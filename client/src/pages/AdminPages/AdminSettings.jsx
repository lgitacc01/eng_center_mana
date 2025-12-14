import React, {useState} from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Separator } from '../../components/ui/separator';
import { Building2, Bell, Lock, Database, Users, Mail, Globe, DollarSign, Palette } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    // General
    centerName: 'DreamClass English Center',
    centerEmail: 'contact@dreamclass.vn',
    centerPhone: '0901234567',
    centerAddress: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
    
    // Notifications
    emailNotifications: '',
    smsNotifications: '',
    assignmentReminders: '',
    feeReminders: '',
    
    // Security
    requireStrongPassword: '',
    sessionTimeout: '30',
    twoFactorAuth: '',
    
    // System
    maxStudentsPerClass: '15',
    academicYear: '2024-2025',
    currency: 'VND',
    timezone: 'Asia/Ho_Chi_Minh',
    
    // Payment
    tuitionFee: '2000000',
    lateFeePercent: '5',
    earlyDiscountPercent: '10'
  });

  const handleSave = () => {
    console.log('Saving settings:', settings);
    alert('Đã lưu cài đặt thành công!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Cài đặt hệ thống</h2>
        <p className="text-muted-foreground mt-1">
          Quản lý cấu hình và tùy chỉnh hệ thống
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
          <TabsTrigger value="general">Chung</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
          <TabsTrigger value="system">Hệ thống</TabsTrigger>
          {/* <TabsTrigger value="payment">Thanh toán</TabsTrigger> */}
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <CardTitle>Thông tin trung tâm</CardTitle>
              </div>
              <CardDescription>
                Cập nhật thông tin cơ bản của trung tâm
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="centerName">Tên trung tâm</Label>
                  <Input
                    id="centerName"
                    value={settings.centerName}
                    onChange={(e) => setSettings({ ...settings, centerName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="centerEmail">Email</Label>
                  <Input
                    id="centerEmail"
                    type="email"
                    value={settings.centerEmail}
                    onChange={(e) => setSettings({ ...settings, centerEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="centerPhone">Số điện thoại</Label>
                  <Input
                    id="centerPhone"
                    value={settings.centerPhone}
                    onChange={(e) => setSettings({ ...settings, centerPhone: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="centerAddress">Địa chỉ</Label>
                  <Textarea
                    id="centerAddress"
                    value={settings.centerAddress}
                    onChange={(e) => setSettings({ ...settings, centerAddress: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                <CardTitle>Giao diện</CardTitle>
              </div>
              <CardDescription>
                Tùy chỉnh màu sắc và logo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Màu chủ đạo</Label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg border-2 border-primary cursor-pointer" />
                    <div className="w-10 h-10 bg-purple-500 rounded-lg border cursor-pointer" />
                    <div className="w-10 h-10 bg-green-500 rounded-lg border cursor-pointer" />
                    <div className="w-10 h-10 bg-orange-500 rounded-lg border cursor-pointer" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo trung tâm</Label>
                  <Input id="logo" type="file" accept="image/*" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <CardTitle>Cài đặt thông báo</CardTitle>
              </div>
              <CardDescription>
                Quản lý các loại thông báo gửi đến người dùng
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo qua Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Gửi thông báo quan trọng qua email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo qua SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Gửi tin nhắn SMS cho phụ huynh
                  </p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nhắc nhở bài tập</Label>
                  <p className="text-sm text-muted-foreground">
                    Tự động nhắc học sinh làm bài tập
                  </p>
                </div>
                <Switch
                  checked={settings.assignmentReminders}
                  onCheckedChange={(checked) => setSettings({ ...settings, assignmentReminders: checked})}
                />
              </div>
              <Separator />
              {/* <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nhắc nhở học phí</Label>
                  <p className="text-sm text-muted-foreground">
                    Thông báo trước hạn đóng học phí
                  </p>
                </div>
                <Switch
                  checked={settings.feeReminders}
                  onCheckedChange={(checked) => setSettings({ ...settings, feeReminders: checked})}
                />
              </div> */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                <CardTitle>Bảo mật</CardTitle>
              </div>
              <CardDescription>
                Cấu hình các tính năng bảo mật hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Yêu cầu mật khẩu mạnh</Label>
                  <p className="text-sm text-muted-foreground">
                    Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, số
                  </p>
                </div>
                <Switch
                  checked={settings.requireStrongPassword}
                  onCheckedChange={(checked) => setSettings({ ...settings, requireStrongPassword: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Xác thực hai yếu tố (2FA)</Label>
                  <p className="text-sm text-muted-foreground">
                    Bật xác thực hai lớp cho tài khoản admin
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked})}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Thời gian hết phiên (phút)</Label>
                <Select
                  value={settings.sessionTimeout}
                  onValueChange={(value) => setSettings({ ...settings, sessionTimeout: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 phút</SelectItem>
                    <SelectItem value="30">30 phút</SelectItem>
                    <SelectItem value="60">60 phút</SelectItem>
                    <SelectItem value="120">120 phút</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                <CardTitle>Cài đặt hệ thống</CardTitle>
              </div>
              <CardDescription>
                Cấu hình chung cho hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Sĩ số tối đa mỗi lớp</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    value={settings.maxStudentsPerClass}
                    onChange={(e) => setSettings({ ...settings, maxStudentsPerClass: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Năm học</Label>
                  <Input
                    id="academicYear"
                    value={settings.academicYear}
                    onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Đơn vị tiền tệ</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) => setSettings({ ...settings, currency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VND">VND - Việt Nam Đồng</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Múi giờ</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => setSettings({ ...settings, timezone: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Ho_Chi_Minh">GMT+7 - Hồ Chí Minh</SelectItem>
                      <SelectItem value="Asia/Bangkok">GMT+7 - Bangkok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sao lưu & Khôi phục</CardTitle>
              <CardDescription>
                Quản lý dữ liệu hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Sao lưu tự động hàng ngày</p>
                  <p className="text-sm text-muted-foreground">Lần cuối: 25/10/2025 02:00</p>
                </div>
                <Button variant="outline">Sao lưu ngay</Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Khôi phục dữ liệu</p>
                  <p className="text-sm text-muted-foreground">Từ bản sao lưu gần nhất</p>
                </div>
                <Button variant="outline">Khôi phục</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                <CardTitle>Cài đặt thanh toán</CardTitle>
              </div>
              <CardDescription>
                Quản lý học phí và chính sách thanh toán
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tuitionFee">Học phí mỗi khóa (VNĐ)</Label>
                  <Input
                    id="tuitionFee"
                    type="number"
                    value={settings.tuitionFee}
                    onChange={(e) => setSettings({ ...settings, tuitionFee: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lateFee">Phí trễ hạn (%)</Label>
                  <Input
                    id="lateFee"
                    type="number"
                    value={settings.lateFeePercent}
                    onChange={(e) => setSettings({ ...settings, lateFeePercent: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="earlyDiscount">Giảm giá đóng sớm (%)</Label>
                  <Input
                    id="earlyDiscount"
                    type="number"
                    value={settings.earlyDiscountPercent}
                    onChange={(e) => setSettings({ ...settings, earlyDiscountPercent: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phương thức thanh toán</CardTitle>
              <CardDescription>
                Cấu hình các kênh thanh toán
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Tiền mặt</p>
                    <p className="text-sm text-muted-foreground">Thanh toán trực tiếp</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Chuyển khoản</p>
                    <p className="text-sm text-muted-foreground">Chuyển khoản ngân hàng</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Ví điện tử</p>
                    <p className="text-sm text-muted-foreground">MoMo, ZaloPay, VNPay</p>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">Hủy thay đổi</Button>
        <Button onClick={handleSave}>Lưu cài đặt</Button>
      </div>
    </div>
  );
}
