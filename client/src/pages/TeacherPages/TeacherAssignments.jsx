// TeacherAssignments.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/apiConfig';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "../../components/ui/card";
import { Button } from '../../components/ui/button';
import { Badge } from "../../components/ui/badge";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "../../components/ui/select";
import CreateAssignment from './CreateAssignment';
import { toast } from "sonner";
import {
  Plus, FileText, Calendar, Users, Clock,
  CheckCircle, BookOpen, Edit, Eye,
  Search, SortDesc, Loader2
} from 'lucide-react';

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // State bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");
  const [filterClass, setFilterClass] = useState("all");
  const [activeTab, setActiveTab] = useState('all');

  // State danh sách lớp học (Lấy từ API để có _id chính xác)
  const [classesList, setClassesList] = useState([]);

  // 1. Lấy danh sách Lớp học & Bài tập khi component load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Gọi song song 2 API: Lấy bài tập & Lấy danh sách lớp giáo viên dạy
      const [assRes, classRes] = await Promise.all([
        api.get('/assignments'), // Xem lại route bên backend
        api.get('/classes')      // Giả sử bạn có route lấy danh sách lớp
      ]);

      console.log("Dữ liệu lớp học lấy về:", classRes.data);

      if (assRes.data.success) {
        setAssignments(assRes.data.assignments);
      }
      if (classRes.data.success) {
        setClassesList(classRes.data.classes || []); // Mảng object: [{_id: '...', name: '...'}, ...]
      } 
      else {
        // Trường hợp API trả về mảng trực tiếp (tùy backend bạn viết)
        if(Array.isArray(classRes.data)) {
            setClassesList(classRes.data);
        }
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      toast.error("Không thể tải danh sách bài tập.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Hàm xử lý Tạo bài tập (Kết nối API Backend)
  const handleCreateAssignment = async (data) => {
    try {
      // Gửi data sang Backend (assignmentController.createAssignment)
      const res = await api.post('/assignments', data);

      if (res.data.success) {
        toast.success("Tạo bài tập thành công!");
        // Cập nhật lại list mà không cần reload
        setAssignments(prev => [res.data.assignment, ...prev]);
        setIsCreateDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Lỗi khi tạo bài tập");
    }
  };


  //  STATUS & TYPE HELPERS
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang mở';
      case 'overdue': return 'Quá hạn';
      case 'draft': return 'Bản nháp';
      case 'completed': return 'Đã hoàn thành';
      default: return 'Không xác định';
    }
  };

  //  FILTERED LIST
  const filteredAssignments = assignments.filter((assignment) => {
      let ok = true;

      if (activeTab !== "all") ok = ok && assignment.status === activeTab;
      if (searchTerm)
        ok = ok && (assignment.title.toLowerCase().includes(searchTerm.toLowerCase()));

      if (filterClass !== "all") {
        const currentClassId = assignment.class_id?._id || assignment.class_id; 
         ok = ok && currentClassId === filterClass;
      }

      return ok;
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600" />
            Quản lý bài tập
          </h1>
          <p className="text-muted-foreground mt-1">
            Tạo và quản lý bài tập với AI & nhiều dạng câu hỏi
          </p>
        </div>

        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tạo bài tập mới
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm bài tập..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Class Filter */}
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Lọc theo lớp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lớp</SelectItem>
                {classesList.map((cls) => (
                  <SelectItem key={cls._id} value={cls._id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SortDesc className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Theo hạn nộp</SelectItem>
                <SelectItem value="title">Theo tiêu đề</SelectItem>
              </SelectContent>
            </Select>

        </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="active">Đang mở</TabsTrigger>
          <TabsTrigger value="draft">Bản nháp</TabsTrigger>
          <TabsTrigger value="overdue">Quá hạn</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {filteredAssignments.map((a) => (
              <Card key={a._id} className="hover:shadow-md transition">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {a.title}
                      </CardTitle>
                      <CardDescription>
                        {a.class_id?.name || "Chưa phân lớp"} - {a.class_id?.code}
                      </CardDescription>
                    </div>

                    <Badge className={getStatusColor(a.status)}>
                      {getStatusText(a.status)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span className="truncate max-w-[150px]" title={a.class_id?.name}>
                        {a.class_id?.name || "Chưa chọn lớp"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {a.dueDate ? new Date(a.dueDate).toLocaleDateString('vi-VN') : 'Không thời hạn'}
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {a.totalPoints} điểm
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" /> {/* Nhớ import icon Clock từ lucide-react */}
                        {a.timeLimit ? `${a.timeLimit} phút` : 'Không giới hạn'}
                      </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" /> Xem bài nộp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

          </div>
        </TabsContent>
      </Tabs>

      {/* EMPTY STATE */}
      {filteredAssignments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">Chưa có bài tập</h3>
            <p className="text-muted-foreground mb-4">Hãy tạo bài đầu tiên!</p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" /> Tạo bài tập mới
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Assignment Modal */}
      <CreateAssignment
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleCreateAssignment}
        classesList={classesList}
      />
    </div>
  );
}
