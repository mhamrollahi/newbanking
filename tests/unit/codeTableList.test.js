const { getData } = require('@controllers/baseInformation/codeTableList');
const { models } = require('@models');
const { CodeTableListModel, UserViewModel } = models;

// Mock کردن مدل‌ها
jest.mock('@models', () => ({
  models: {
    CodeTableListModel: {
      findAll: jest.fn()
    },
    UserViewModel: {
      attributes: ['username', 'fullName']
    }
  }
}));

describe('CodeTableList Controller', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    // تنظیم mock های مورد نیاز
    mockReq = {};
    mockRes = {
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getData', () => {
    it('should return code table list data with creator information', async () => {
      // تنظیم داده‌های تست
      const mockData = [
        {
          id: 1,
          fa_TableName: 'جدول تست',
          en_TableName: 'Test Table',
          creator: {
            username: 'testuser',
            fullName: 'کاربر تست'
          }
        }
      ];

      // تنظیم رفتار mock
      CodeTableListModel.findAll.mockResolvedValue(mockData);

      // اجرای تابع
      await getData(mockReq, mockRes, mockNext);

      // بررسی نتایج
      expect(CodeTableListModel.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: UserViewModel,
            as: 'creator',
            attributes: ['username', 'fullName']
          }
        ]
      });
      expect(mockRes.json).toHaveBeenCalledWith(mockData);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle errors and call next with error', async () => {
      // تنظیم خطا
      const mockError = new Error('Test error');
      CodeTableListModel.findAll.mockRejectedValue(mockError);

      // اجرای تابع
      await getData(mockReq, mockRes, mockNext);

      // بررسی نتایج
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });
});