// // services/studentService.js
// import api from './api';

// // #################################################################
// //  ACADEMIC YEAR URL
// // #################################################################
// export const getAllAcademicYear = () =>
//   api.get('/academicYear/AllAcademicYears');
// export const getActiveAcademicYear = (active) =>
//   api.get(`/academicYear/activeAcademicYear/${active}`);

// export const createAcademicYear = () =>
//   api.post('/academicYear/createAcademicYear');

// export const updateAcademicYear = (id, data) =>
//   api.put(`/academicYear/updateAcademicYear/${id}`, data);
// export const deleteAcademicYear = (id) =>
//   api.delete(`/academicYear/deleteAcademicYear/${id}`);

// // #################################################################
// //  CLASSES URL
// // #################################################################
// export const createClasse = (data) => api.post('/classes/createClasse', data);

// export const getAllClasses = () => api.get('/classes/getAllClasses');

// export const getOneClasses = (id) => api.get(`/classes/getOneClasse/${id}`);
// export const updateClasse = (id, data) =>
//   api.put(`/classes/updateClasse/${id}`, data);

// export const deleteClasse = (id) => api.delete(`/classes/deleteClasse/${id}`);

// export const deleteAllClasses = (id) =>
//   api.delete(`/classes/deleteAllClasses/${id}`);

// // #################################################################
// //  STUDENTS URL
// // #################################################################
// export const getAllStudents = () => api.get('/students/allStudents');
// export const getStudentById = (id) => api.get(`/students/getStudent/${id}`);
// export const createStudent = (data) => api.post('/students/newStudent', data);
// export const updateStudent = (id, data) =>
//   api.put(`/students/updateStudent/${id}`, data);
// export const deleteStudent = (id) =>
//   api.delete(`/students/deleteStudent/${id}`);
// export const deleteAllStudents = (id) =>
//   api.delete(`/students/deleteAllStudents/${id}`);

// // #################################################################
// //  TEACHER URL
// // #################################################################
// export const createTeacher = (data) =>
//   api.post('/teachers/createTeacher', data);

// export const getAllTeachers = () => api.get('/teachers/allteachers');
// export const getOneTeacher = (id) => api.get(`/teachers/getOneTeacher/${id}`);
// export const updateTeacher = (id, data) =>
//   api.put(`/teachers/updateTeacher/${id}`, data);
// export const deleteTeacher = (id) =>
//   api.delete(`/teachers/deleteTeacher/${id}`);
// export const deleteAllTeacher = (id) =>
//   api.delete(`/teachers/deleteAllTeacher/${id}`);
