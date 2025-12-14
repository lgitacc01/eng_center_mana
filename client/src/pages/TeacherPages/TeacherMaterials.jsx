import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { 
  Plus, 
  Search,
  FileAudio, 
  FileText, 
  FileType,
  FileVideo,
  Image as ImageIcon, 
  Video, 
  File, 
  Download, 
  Eye, 
  Share2, 
  Edit, 
  Trash2,
  MoreVertical,
  Upload,
  Filter,
  BookOpen,
  FileSpreadsheet,
  Presentation,
  Music
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";

export default function TeacherMaterials() {
  const [materials, setMaterials] = useState([]);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // State form
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  // State Upload & Edit
  const [selectedFile, setSelectedFile] = useState(null); // State lưu file upload
  const [editingId, setEditingId] = useState(null); // ID tài liệu đang sửa (null = tạo mới)
  const [currentFileName, setCurrentFileName] = useState("");
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'pdf',
    classes: [], // Để mảng để xử lý nhiều lớp
    tags: ''
  });

  // 1. Fetch Data
  const fetchMaterials = async () => {
    setLoading(true);
    try {
      // Gọi song song: Lấy tài liệu và Lấy danh sách lớp của giáo viên này
      const [resMaterials, resClasses] = await Promise.all([
        api.get('/materials'),
        api.get('/classes') // Backend đã tự lọc lớp của GV này dựa trên token
      ]);

      const mapped = resMaterials.data.map(m => ({
        id: m._id,
        title: m.title,
        description: m.description,
        type: m.type,
        size: m.size || 'Unknown',
        uploadDate: m.createdAt,
        classes: m.classes || [],
        tags: m.tags || [],
        views: m.views || 0,
        downloads: m.downloads || 0,
        filePath: m.file_path,
        status: m.status || 'pending',
        scope: m.scope,
        uploader: m.uploader_id ? m.uploader_id.full_name : "Không xác định"
      }));
      setMaterials(mapped);

      // Lưu danh sách lớp vào state
      setTeacherClasses(resClasses.data);
    } catch (error) {
      console.error("Lỗi tải tài liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // 2. Reset Form
  const resetForm = () => {
    setFormData({ title: '', description: '', type: 'pdf', classes: [], tags: '' });
    setSelectedFile(null);
    setEditingId(null);
    setCurrentFileName(""); // Reset tên file cũ
    setIsDialogOpen(false);
  };

  // 3. Xử lý mở Dialog để Sửa
  const handleEditClick = (material) => {
    setEditingId(material.id);

    // Lấy tên file từ đường dẫn (VD: uploads/materials/123-abc.pdf -> 123-abc.pdf)
    const fileName = material.filePath ? material.filePath.split(/[/\\]/).pop() : "";
    setCurrentFileName(fileName); // Lưu tên file cũ

    setFormData({
      title: material.title,
      description: material.description,
      type: material.type,
      classes: material.classes,
      tags: (material.tags || []).join(', ')
    });
    setSelectedFile(null); // Reset file (người dùng có thể không muốn đổi file)
    setIsDialogOpen(true);
  };

  // 4. Xử lý Lưu (Tạo mới hoặc Cập nhật)
  const handleSave = async () => {
    if (!formData.title) {
        alert("Vui lòng nhập tên tài liệu!");
        return;
    }
    // Nếu tạo mới thì bắt buộc có file, nếu sửa thì file là tùy chọn
    if (!editingId && !selectedFile) {
        alert("Vui lòng chọn file!");
        return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('type', formData.type);
    data.append('classes', formData.classes.join(','));
    data.append('tags', formData.tags);
    
    if (selectedFile) {
        data.append('file', selectedFile);
    }

    try {
        if (editingId) {
            // Logic Cập nhật
            await api.put(`/materials/${editingId}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Cập nhật thành công!");
        } else {
            // Logic Tạo mới
            await api.post('/materials/create', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Upload thành công!");
        }
        
        resetForm();
        fetchMaterials();
    } catch (error) {
        console.error(error);
        alert("Lỗi khi lưu tài liệu");
    } finally {
        setLoading(false);
    }
  };

  // // 5. Xử lý Xóa
  // const handleDelete = async (id) => {
  //   if(!window.confirm("Bạn chắc chắn muốn xóa tài liệu này?")) return;
  //   try {
  //       await api.delete(`/materials/${id}`);
  //       setMaterials(materials.filter(m => m.id !== id));
  //   } catch (error) {
  //       alert("Lỗi khi xóa");
  //   }
  // };

  
  // const handleView = (filePath) => {
  //     if (!filePath) return;

  //     // Kiểm tra: Nếu là link Cloudinary (có http) thì dùng luôn
  //     // Nếu là link Local (không có http) thì nối serverUrl
  //     const serverUrl = 'http://localhost:5000';
  //     const cleanPath = filePath.replace(/\\/g, '/');
  //     window.open(`${serverUrl}/${cleanPath}`, '_blank');
  // };

  // const handleDownload = (id) => {
  //     const serverUrl = 'http://localhost:5000';
  //     window.open(`${serverUrl}/materials/download/${id}`, '_blank');
  // };

  // --- 6. LOGIC XEM & TẢI ---
  const handleOpenFile = (filePath) => {
      if (!filePath) return;
      
      // Kiểm tra: Nếu là link Cloudinary (có http) thì dùng luôn
      // Nếu là link Local (không có http) thì nối serverUrl
      let finalUrl = filePath;
      if (!filePath.startsWith('http')) {
          const serverUrl = 'http://localhost:5000';
          const cleanPath = filePath.replace(/\\/g, '/'); // Sửa lỗi đường dẫn Windows
          // Xử lý dấu / thừa nếu có
          finalUrl = cleanPath.startsWith('/') 
              ? `${serverUrl}${cleanPath}` 
              : `${serverUrl}/${cleanPath}`;
      }

      window.open(finalUrl, '_blank');
  };

  // Gán 2 hàm này trỏ về cùng 1 logic mở link
  const handleView = (filePath) => handleOpenFile(filePath);
  const handleDownload = (filePath) => handleOpenFile(filePath);
  
  // --- LOGIC UI GIỮ NGUYÊN ---
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || material.type === filterType;
    const matchesClass = filterClass === 'all' || material.classes.includes(filterClass);
    return matchesSearch && matchesType && matchesClass;
  });

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
      return <FileText className="w-6 h-6 text-red-500" />;
    case 'word':
      return <FileType className="w-6 h-6 text-blue-500" />;
    case 'ppt':
      return <FileType className="w-6 h-6 text-orange-500" />;
    case 'video':
      return <FileVideo className="w-6 h-6 text-purple-500" />;
    case 'image':
      return <FileImage className="w-6 h-6 text-green-500" />;
    case 'audio':
      return <FileAudio className="w-6 h-6 text-yellow-500" />;
    default:
      return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const getFileColor = (type) => {
    switch (type) {
      case 'pdf': return 'bg-red-100 text-red-600';
      case 'word': return 'bg-blue-100 text-blue-600';
      case 'ppt': return 'bg-orange-100 text-orange-600';
      case 'video': return 'bg-purple-100 text-purple-600';
      case 'image': return 'bg-green-100 text-green-600';
      case 'audio': return 'bg-pink-100 text-pink-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'pdf': return 'PDF';
      case 'word': return 'Word';
      case 'ppt': return 'PowerPoint';
      case 'video': return 'Video';
      case 'image': return 'Hình ảnh';
      case 'audio': return 'Audio';
      default: return 'Khác';
    }
  };

  const getStatusLable = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Đã duyệt</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Từ chối</Badge>;
      default: // pending
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">Chờ duyệt</Badge>;
    }
  };

  const stats = [
    { label: 'Tổng tài liệu', value: materials.length, color: 'text-blue-600' },
    { label: 'Lượt xem', value: materials.reduce((sum, m) => sum + m.views, 0), color: 'text-green-600' },
    { label: 'Lượt tải', value: materials.reduce((sum, m) => sum + m.downloads, 0), color: 'text-purple-600' },
    { label: 'Tháng này', value: materials.filter(m => new Date(m.uploadDate).getMonth() === 9).length, color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Tài liệu học tập</h2>
          <p className="text-muted-foreground mt-1">
            Quản lý và chia sẻ tài liệu với học sinh
          </p>
        </div>
        {/* DIALOG */}
        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && resetForm()}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4" /> Thêm tài liệu</Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Cập nhật tài liệu" : "Thêm tài liệu mới"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Sửa lại thông tin và chọn file mới để tải lên hệ thống (hoặc giữa file cũ) " 
                : "Điền thông tin và chọn file để tải lên hệ thống."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Tên tài liệu */}
              <div className="space-y-2">
                <Label htmlFor="title">Tên tài liệu <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  placeholder="VD: Grammar Rules"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              
              {/* Mô tả */}
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả ngắn gọn..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Loại & Lớp */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Loại tài liệu</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value})}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="word">Word</SelectItem>
                      <SelectItem value="ppt">PowerPoint</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="image">Hình ảnh</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="classes">Lớp học</Label>
                  <Select
                    onValueChange={(value) => {
                      if (!formData.classes.includes(value)) {
                        setFormData({ ...formData, classes: [...formData.classes, value] });
                      }
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Chọn lớp" /></SelectTrigger>
                    <SelectContent>
                      {teacherClasses.length > 0 ? (
                          teacherClasses.map(cls => (
                              <SelectItem key={cls._id} value={cls.name}>{cls.name}</SelectItem>
                          ))
                      ) : (
                          <div className="p-2 text-sm text-muted-foreground">Bạn chưa có lớp nào</div>
                      )}
                    </SelectContent>
                  </Select>
                  
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.classes.map((cls) => (
                        <Badge
                          key={cls}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive/20"
                          onClick={() => setFormData({
                            ...formData,
                            classes: formData.classes.filter(c => c !== cls)
                          })}
                        >
                          {cls} ×
                        </Badge>
                      ))}
                    </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="VD: Beginner, Exercises"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>

              {/* Chọn File*/}
              <div className="space-y-2">
                <Label htmlFor="file-upload">File đính kèm {editingId ? "(Chỉ chọn nếu muốn thay đổi)" : "*"} <span className="text-red-500">*</span></Label>
                
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden" 
                  onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                      }
                  }}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mp3,.jpg,.png"
                />

                <Label 
                  htmlFor="file-upload" 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 hover:border-primary transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      {selectedFile 
                        ? "Đã chọn file mới" 
                        : (editingId && currentFileName) 
                          ? "Đang dùng file cũ" 
                          : "Kéo thả hoặc click để chọn file"}
                    </p>
                    {/* Hiển thị tên file (Mới hoặc Cũ) */}
                    <p className="text-xs font-medium text-blue-600 mt-1">
                       {selectedFile ? selectedFile.name : (currentFileName || "")}
                    </p>
                  </div>
                </Label>

                {selectedFile && (
                  <div className="flex items-center justify-between p-2 mt-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                      <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                      <Button 
                          variant="ghost" size="sm" className="text-red-500 h-6 w-6 p-0"
                          onClick={() => setSelectedFile(null)} 
                      >
                          ×
                      </Button>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} type="button">Hủy</Button>
              <Button onClick={handleSave} disabled={loading || !formData.title || (!editingId && !selectedFile)}>
                {loading ? "Đang xử lý..." : (editingId ? "Cập nhật" : "Upload")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* --- KẾT THÚC DIALOG --- */}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm tài liệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Loại tài liệu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="word">Word</SelectItem>
                <SelectItem value="ppt">PowerPoint</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="image">Hình ảnh</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Lớp học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lớp</SelectItem>
                {teacherClasses.map(cls => (
                     <SelectItem key={cls._id} value={cls.name}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <BookOpen className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <FileText className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-lg ${getFileColor(material.type)} flex items-center justify-center`}>
                    {getFileIcon(material.type)}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(material.filePath)}><Eye className="w-4 h-4 mr-2" /> Xem</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(material.filePath)}><Download className="w-4 h-4 mr-2" /> Tải xuống</DropdownMenuItem>
                      {material.scope !== 'center' && (
                        <>
                          <DropdownMenuItem onClick={() => handleEditClick(material)}><Edit className="w-4 h-4 mr-2" /> Chỉnh sửa</DropdownMenuItem>
                        {/* <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteMaterial(material.id)}><Trash2 className="w-4 h-4 mr-2" /> Xóa</DropdownMenuItem> */}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="mt-4 line-clamp-2">{material.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {material.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{material.size}</span>
                  {/* <Badge variant="secondary">{getTypeLabel(material.type)}</Badge> */}
                  <div className="flex gap-2 items-center">
                    {/* 👇 HIỂN THỊ BADGE DÙNG CHUNG */}
                    {material.scope === 'center' && <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200">Dùng chung</Badge>}
                    {getStatusLable(material.status)}
                    <Badge variant="secondary">{getTypeLabel(material.type)}</Badge>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {material.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1">
                  {material.classes.map((cls) => (
                    <Badge key={cls} variant="default" className="text-xs">
                      {cls}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {material.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {material.downloads}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(material.uploadDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleView(material.filePath)}>
                    <Eye className="w-3 h-3 mr-1" />
                    Xem
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDownload(material.filePath)}>
                    <Download className="w-3 h-3 mr-1" />
                    Tải về
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Danh sách tài liệu</CardTitle>
            <CardDescription>{filteredMaterials.length} tài liệu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredMaterials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-lg ${getFileColor(material.type)} flex items-center justify-center flex-shrink-0`}>
                    {getFileIcon(material.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* <h3 className="font-medium line-clamp-1">{material.title}</h3> */}
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium line-clamp-1">{material.title}</h3>
                      {getStatusLable(material.status)} 
                      {material.scope === 'center' && <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200">Dùng chung</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                      {material.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground">{material.size}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Eye className="w-3 h-3" />
                        {material.views}
                      </div>
                      <span className="text-xs text-muted-foreground">•</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Download className="w-3 h-3" />
                        {material.downloads}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {material.classes.map((cls) => (
                      <Badge key={cls} variant="secondary" className="text-xs">
                        {cls}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" onClick={() => handleView(material.filePath)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(material.id)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(material)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Sửa
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteMaterial(material.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Không tìm thấy tài liệu</h3>
              <p className="text-muted-foreground mb-4">
                Thử thay đổi bộ lọc hoặc thêm tài liệu mới
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm tài liệu đầu tiên
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
