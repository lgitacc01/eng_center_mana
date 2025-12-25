import React, {useState, useEffect} from 'react';
import api from '../../api/apiConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import {
  Circle, 
  Search, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  File,
  FileType,
  FileImage,
  FileAudio,
  FileVideo, 
  Download, 
  Eye,
  BookOpen,
  FileSpreadsheet,
  Presentation,
  Music,
  Star,
  Clock,
  Sparkles
} from 'lucide-react';



export function StudentMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 1. Fetch Data
  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        // Gọi API (Backend tự lọc cho HS)
        const res = await api.get('/materials');
        
        const mapped = res.data.map(m => ({
          id: m._id,
          title: m.title,
          description: m.description,
          type: m.type,
          size: m.size || 'Unknown',
          uploadDate: m.createdAt,
          classes: m.classes || [],
          filePath: m.file_path,
          uploader: m.uploader_id ? m.uploader_id.full_name : "Giáo viên",
          views: m.views,
          downloads: m.downloads,
          scope: m.scope
        }));
        setMaterials(mapped);
      } catch (error) {
        console.error("Lỗi tải tài liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  // --- HÀM XỬ LÝ LINK THÔNG MINH ---
  const handleOpenFile = (filePath) => {
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

  const handleView = (filePath) => handleOpenFile(filePath);
  const handleDownload = (filePath) => handleOpenFile(filePath);
  
  // // Lọc chỉ tài liệu của lớp học sinh
  // const studentMaterials = studentMaterials.filter(material => 
  //   material.classes.includes(studentClass)
  // );

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || material.type === filterType;
    return matchesSearch && matchesType;
  });

  const getFileIcon = (type) => {
    switch (type) {
     case "pdf":
      return <FileText className="w-6 h-6 text-red-500" />;
    case "word":
      return <FileType className="w-6 h-6 text-blue-500" />;
    case "ppt":
      return <FileSpreadsheet className="w-6 h-6 text-orange-500" />;
    case "video":
      return <FileVideo className="w-6 h-6 text-purple-500" />;
    case "image":
      return <FileImage className="w-6 h-6 text-green-500" />;
    case "audio":
      return <FileAudio className="w-6 h-6 text-yellow-500" />;
    default:
      return <File className="w-6 h-6 text-gray-400" />;
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

  const newMaterials = filteredMaterials.filter(m => m.isNew);
  // Sắp xếp theo lượt xem để lấy phổ biến
  const popularMaterials = [...filteredMaterials].sort((a, b) => b.views - a.views).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header with fun emoji */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6" />  
          </div>
          <div>
            <h2 className="text-3xl font-bold">Tài liệu học tập 📚</h2>
            <p className="text-blue-100 mt-1">
              Danh sách tài liệu dành cho các lớp học của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700">Tổng tài liệu</p>
                <p className="text-2xl font-bold text-blue-900">{materials.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-700">Tài liệu mới</p>
                <p className="text-2xl font-bold text-purple-900">{newMaterials.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700">Phổ biến</p>
                <p className="text-2xl font-bold text-green-900">{popularMaterials.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Materials Section */}
      {newMaterials.length > 0 && (
        <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-600" />
              <CardTitle className="text-yellow-900">Tài liệu mới nhất ✨</CardTitle>
            </div>
            <CardDescription>Giáo viên vừa thêm tài liệu mới cho bạn!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newMaterials.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-yellow-200 hover:shadow-lg transition-shadow"
                  onClick={() => handleView(material.filePath)}
                >
                  <div className={`w-12 h-12 rounded-lg ${getFileColor(material.type)} flex items-center justify-center flex-shrink-0`}>
                    {getFileIcon(material.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium line-clamp-1">{material.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {material.size} • {new Date(material.uploadDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">Mới</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm tài liệu học tập..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Loại tài liệu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="word">Word</SelectItem>
                <SelectItem value="ppt">PowerPoint</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="image">Hình ảnh</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Materials Grid */}
      {loading ? (
         <div className="text-center py-12 text-gray-500">Đang tải tài liệu...</div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <Card key={material.id} className="hover:shadow-xl transition-all hover:scale-105 duration-200 border-2">
            <CardHeader>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-14 h-14 rounded-xl ${getFileColor(material.type)} flex items-center justify-center shadow-lg`}>
                  {getFileIcon(material.type)}
                </div>
                <div className="flex gap-2 items-center">
                 {/* 👇 HIỂN THỊ BADGE DÙNG CHUNG */}
                 {material.scope === 'center' && <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200">Dùng chung</Badge>}
                  <Badge variant="secondary">{getTypeLabel(material.type)}</Badge>
                </div>
                {/* <Badge variant="outline">{getTypeLabel(material.type)}</Badge> */}
                {/* {material.isNew && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Mới
                  </Badge>
                )} */}
              </div>
              <CardTitle className="line-clamp-2 text-lg" title={material.title}>{material.title}</CardTitle>
              <CardDescription className="line-clamp-2 text-sm">
                {material.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <Badge variant="secondary" className="font-medium">
                  {getTypeLabel(material.type)}
                </Badge>
                <span className="text-muted-foreground">{material.size}</span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {(material.tags || []).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-gradient-to-r from-blue-50 to-purple-50">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{material.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  <span>{material.downloads}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(material.uploadDate).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleView(material.filePath)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Xem
                </Button>
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  onClick={() => handleDownload(material.filePath)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Tải về
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      {/* // Empty State */}
      {!loading && filteredMaterials.length === 0 && (
        <Card className="border-2 border-dashed">
          <CardContent className="py-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Không tìm thấy tài liệu 🔍</h3>
              <p className="text-muted-foreground mb-4">
                Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
