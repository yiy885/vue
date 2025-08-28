import apiService from './api'

export default {
  create (data) {
    return apiService.apiAuth.post('/templates', data)
  },
  getAll () {
    return apiService.apiAuth.get('/templates') // 後端路由一致
  },
  getUser () {
    return apiService.apiAuth.get('/templates/user') // 查詢自己建立的模板
  },
  getId (id) {
    return apiService.api.get(`/templates/${id}`)
  },
  update (id, data) {
    return apiService.apiAuth.put(`/templates/${id}`, data) // 改成 PUT
  },
  delete (id) {
    return apiService.apiAuth.delete(`/templates/${id}`)
  }
}

// src/services/project.js
// import apiService from './api';

// const projectService = {
//   /**
//    * 創建新專案 (對應後端 controller/project.js 中的 createProject)
//    * @param {Object} projectData - 專案數據，包含 name, description, category 等
//    * @returns {Promise<Object>} - 包含新創建專案數據的 Promise
//    */
//   async createProject(projectData) {
//     try {
//       // 假設後端創建專案的路由是 /projects
//       const response = await apiService.apiAuth.post('/projects', projectData);
//       return response.data;
//     } catch (error) {
//       console.error('Error creating project:', error);
//       throw error;
//     }
//   },

//   /**
//    * 獲取所有專案列表 (對應後端 controller/project.js 中的 getAllProjects)
//    * @returns {Promise<Array>} - 包含專案列表的 Promise
//    */
//   async getAllProjects() {
//     try {
//       // 假設後端獲取所有專案的路由是 /projects
//       const response = await apiService.apiAuth.get('/projects');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching projects:', error);
//       throw error;
//     }
//   },

//   /**
//    * 根據 ID 獲取單個專案詳細信息 (對應後端 controller/project.js 中的 getProjectById)
//    * @param {string} projectId - 專案的 ID
//    * @returns {Promise<Object>} - 包含單個專案數據的 Promise
//    */
//   async getProjectById(projectId) {
//     try {
//       const response = await apiService.apiAuth.get(`/projects/${projectId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching single project:', error);
//       throw error;
//     }
//   },

//   /**
//    * 刪除專案 (對應後端 controller/project.js 中的 deleteProject)
//    * @param {string} projectId - 專案的 ID
//    * @returns {Promise<Object>} - 刪除結果的 Promise
//    */
//   async deleteProject(projectId) {
//     try {
//       const response = await apiService.apiAuth.delete(`/projects/${projectId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error deleting project:', error);
//       throw error;
//     }
//   },
// };

// export default projectService;

