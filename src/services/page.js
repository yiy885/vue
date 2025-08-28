import apiService from './api';

// export default {
//   // 保存或更新網頁（全量或部分更新）
//   save(userId, data) {
//     return apiService.apiAuth.post(`/project/user/${userId}`, data);
//   },

//   // 獲取用戶網頁數據
//   getByUserId(userId) {
//     return apiService.apiAuth.get(`/project/user/${userId}`);
//   },

//   // 刪除網頁
//   deletePage(pageId) {
//     return apiService.apiAuth.delete(`/project/${pageId}`);
//   },

//   // 上傳圖片（與 cloudUpload 中間件整合）
//   uploadImage(userId, file) {
//     const formData = new FormData();
//     formData.append('image', file);
//     formData.append('title', '臨時網頁');
//     formData.append('modules', JSON.stringify([
//       {
//         type: 'image',
//         content: [
//           { field: 'url', value: '', rules: ['required', 'url'] },
//           { field: 'alt', value: '上傳的圖片', rules: [] },
//           { field: 'width', value: 300, rules: ['min:100'] },
//           { field: 'height', value: 200, rules: ['min:100'] },
//         ],
//         order: 0,
//       },
//     ]));
//     formData.append('partialUpdate', 'false');
//     return apiService.apiAuth.post(`/project/user/${userId}`, formData);
//   },
// };

//依照gemini規範
// src/services/page.js

const pageService = {
  /**
   * 根據 templateId 從後端獲取網頁數據
   * @param {string} templateId - 網頁範本的 ID
   * @returns {Promise<Object>} 包含網頁數據的 Promise
   */
  async getPageByTemplateId(templateId) {
    try {
      // 後端路由: GET /pages/:templateId
      const response = await apiService.apiAuth.get(`/pages/${templateId}`);
      return response.data;
    } catch (error) {
      console.error('Error in getPageByTemplateId:', error);
      throw error;
    }
  },

  /**
   * 保存或更新網頁數據到後端
   * @param {string} templateId - 網頁範本的 ID
   * @param {Object} pageData - 包含 title 和 modules 的網頁數據
   * @returns {Promise<Object>} 包含保存後網頁數據的 Promise
   */
  async savePage(templateId, pageData) {
    try {
      // 後端路由: POST /pages/:templateId
      const response = await apiService.apiAuth.post(`/pages/${templateId}`, pageData);
      return response.data;
    } catch (error) {
      console.error('Error in savePage:', error);
      throw error;
    }
  },

  /**
   * 刪除指定 ID 的網頁
   * @param {string} pageId - 要刪除的網頁 ID
   * @returns {Promise<Object>} 刪除結果的 Promise
   */
  async deletePage(pageId) {
    try {
      // 後端路由: DELETE /pages/:pageId
      const response = await apiService.apiAuth.delete(`/pages/${pageId}`);
      return response.data;
    } catch (error) {
      console.error('Error in deletePage:', error);
      throw error;
    }
  },
};

export default pageService;
