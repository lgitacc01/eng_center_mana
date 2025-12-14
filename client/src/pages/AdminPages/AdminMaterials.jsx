import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { 
  Search, FileText, Eye, CheckCircle, XCircle, Download, Trash2, MoreVertical, User, RotateCcw, BookOpen, Plus
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";

export default function AdminMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // pending | approved | rejected
  const [searchQuery, setSearchQuery] = useState('');

  // State cho Upload
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', type: 'pdf', tags: ''
  });

  // 1. Fetch Data theo Status
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      // Gọi API kèm query param status
      const res = await api.get(`/materials?status=${activeTab}`);
      const mapped = res.data.map(m => ({
        id: m._id,
        title: m.title,
        description: m.description,
        type: m.type,
        size: m.size || 'Unknown',
        uploadDate: m.createdAt,
        classes: m.classes || [],
        filePath: m.file_path,
        status: m.status,
        scope: m.scope, // Lấy scope
        uploader: m.uploader_id ? m.uploader_id.full_name : "Không xác định"
      }));
      setMaterials(mapped);
    } catch (error) {
      console.error("Lỗi tải tài liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi lại API mỗi khi chuyển Tab
  useEffect(() => {
    fetchMaterials();
  }, [activeTab]);

  // 2. Handle Upload (Admin Upload)
  const handleUpload = async () => {
    if (!formData.title || !selectedFile) return alert("Thiếu thông tin!");
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('type', formData.type);
    data.append('tags', formData.tags);
    data.append('file', selectedFile);
    // Không cần gửi classes vì tài liệu chung

    try {
        await api.post('/materials/create', data, { headers: { 'Content-Type': 'multipart/form-data' } });
        alert("Upload thành công vào Thư viện chung!");
        setIsDialogOpen(false);
        setFormData({ title: '', description: '', type: 'pdf', tags: '' });
        setSelectedFile(null);
        // Nếu đang ở tab Approved thì reload, nếu không thì chuyển tab
        if (activeTab === 'approved') fetchMaterials();
        else setActiveTab('approved');
    } catch (e) {
      console.error(e); 
      alert("Lỗi upload"); }
  };

  // 3. Xử lý Duyệt / Từ chối / Duyệt lại
  const handleApprove = async (id, status) => {
      let confirmMsg = "";
      if (status === 'approved') confirmMsg = "Bạn muốn DUYỆT tài liệu này?";
      else if (status === 'rejected') confirmMsg = "Bạn muốn TỪ CHỐI tài liệu này?";
      
      if (!confirm(confirmMsg)) return;

      try {
          await api.put(`/materials/approve/${id}`, { status });
          alert("Cập nhật trạng thái thành công!");
          fetchMaterials(); // Reload list
      } catch (error) {
        console.error(error);
        alert("Lỗi khi cập nhật trạng thái");
      }
  };

  // 3. Xử lý Xóa (Nếu cần)
  const handleDelete = async (id) => {
    if(!confirm("Xóa vĩnh viễn tài liệu này?")) return;
    try {
        await api.delete(`/materials/${id}`);
        fetchMaterials();
    } catch (error) {
      console.error(error); 
      alert("Lỗi xóa"); }
  };

  const handleView = (filePath) => {
    if (!filePath) return;
    
    let finalUrl = filePath;
    if (!filePath.startsWith('http')) {
        const serverUrl = 'http://localhost:5000';
        const cleanPath = filePath.replace(/\\/g, '/');
        finalUrl = cleanPath.startsWith('/') 
            ? `${serverUrl}${cleanPath}` 
            : `${serverUrl}/${cleanPath}`;
    }
    window.open(finalUrl, '_blank');
  };

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold">Kiểm duyệt tài liệu</h2>
        <p className="text-muted-foreground mt-1">Duyệt các tài liệu do giáo viên tải lên trước khi hiển thị cho học sinh</p>
      </div>
      {/* Nút Upload cho Admin */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4"/> Thêm tài liệu chung</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Upload tài liệu chung</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2"><Label>Tên tài liệu</Label><Input value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})}/></div>
                    <div className="space-y-2"><Label>Mô tả</Label><Textarea value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})}/></div>
                    <div className="space-y-2"><Label>Loại</Label>
                        <Select value={formData.type} onValueChange={v=>setFormData({...formData, type: v})}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent><SelectItem value="pdf">PDF</SelectItem><SelectItem value="word">Word</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2"><Label>File</Label><Input type="file" onChange={e=>setSelectedFile(e.target.files[0])}/></div>
                </div>
                <DialogFooter><Button onClick={handleUpload}>Upload</Button></DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
          <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
          <TabsTrigger value="rejected">Đã từ chối</TabsTrigger>
        </TabsList>
        
        <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input 
                placeholder="Tìm kiếm..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
            />
        </div>

        {/* Nội dung Tabs */}
        <TabsContent value={activeTab} className="space-y-4">
            {loading ? <div className="text-center py-8">Đang tải...</div> : 
             filteredMaterials.length === 0 ? <div className="text-center py-8 text-muted-foreground">Không có tài liệu nào.</div> :
            (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.map((m) => (
                    <Card key={m.id} className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <Badge variant="outline">{m.type.toUpperCase()}</Badge>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4"/></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleDelete(m.id)} className="text-red-500">Xóa vĩnh viễn</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <CardTitle className="text-lg line-clamp-1" title={m.title}>{m.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{m.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <User className="w-4 h-4" /> 
                                <span className="font-medium">{m.uploader}</span> {/* 👈 HIỂN THỊ TÊN GIÁO VIÊN */}
                            </div>
                            {/* 👇 HIỂN THỊ DANH SÁCH LỚP Ở ĐÂY 👇 */}
                            <div className="flex flex-wrap gap-1 mb-3">
                                {m.classes && m.classes.length > 0 ? (
                                    m.classes.map((cls, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-[10px] px-1 h-5 font-normal flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" /> {cls}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-xs text-muted-foreground italic">Chưa gán lớp</span>
                                )}
                            </div>
                            {/* --------------------------------- */}
                            <div className="text-xs text-muted-foreground mb-4">
                                Ngày up: {new Date(m.uploadDate).toLocaleDateString('vi-VN')} • Size: {m.size}
                            </div>
                            
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(m.filePath)}>
                                    <Eye className="w-4 h-4 mr-2"/> Xem
                                </Button>
                                
                                {activeTab === 'pending' && (
                                <>
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(m.id, 'approved')}>
                                        <CheckCircle className="w-4 h-4"/>
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleApprove(m.id, 'rejected')}>
                                        <XCircle className="w-4 h-4"/>
                                    </Button>
                                </>
                                )}

                                {/* --- TAB 2: ĐÃ DUYỆT (THÊM MỚI: GỠ BỎ) --- */}
                                {activeTab === 'approved' && (
                                    <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleApprove(m.id, 'rejected')}>
                                        <XCircle className="w-4 h-4 mr-2"/> Gỡ bỏ
                                    </Button>
                                )}
                                
                                {/* NÚT DUYỆT LẠI CHO TAB REJECTED */}
                                {activeTab === 'rejected' && (
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white flex-1" onClick={() => handleApprove(m.id, 'approved')}>
                                        <RotateCcw className="w-4 h-4 mr-2"/> Duyệt lại
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}