import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export function authConfig() {
  const token = localStorage.getItem("admin_token");
  return {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
}

export const portalApi = {
  // Batches
  listBatches: () => axios.get(`${API}/portal/batches`, authConfig()),
  createBatch: (data) => axios.post(`${API}/portal/batches`, data, authConfig()),
  updateBatch: (id, data) => axios.put(`${API}/portal/batches/${id}`, data, authConfig()),
  deleteBatch: (id) => axios.delete(`${API}/portal/batches/${id}`, authConfig()),
  addHoliday: (id, data) => axios.post(`${API}/portal/batches/${id}/holidays`, data, authConfig()),
  removeHoliday: (id, date) => axios.delete(`${API}/portal/batches/${id}/holidays?date=${date}`, authConfig()),

  // Students
  listStudents: (params) => axios.get(`${API}/portal/students`, { ...authConfig(), params }),
  getStudent: (id) => axios.get(`${API}/portal/students/${id}`, authConfig()),
  createStudent: (data) => axios.post(`${API}/portal/students`, data, authConfig()),
  updateStudent: (id, data) => axios.put(`${API}/portal/students/${id}`, data, authConfig()),
  deleteStudent: (id) => axios.delete(`${API}/portal/students/${id}`, authConfig()),
  uploadPhoto: (id, file) => {
    const form = new FormData();
    form.append("photo", file);
    return axios.post(`${API}/portal/students/${id}/photo`, form, {
      ...authConfig(),
      headers: { ...authConfig().headers, "Content-Type": "multipart/form-data" },
    });
  },
  downloadTemplate: () => axios.get(`${API}/portal/students/template/download`, {
    ...authConfig(),
    responseType: "blob",
  }),
  bulkUpload: (file) => {
    const form = new FormData();
    form.append("file", file);
    return axios.post(`${API}/portal/students/bulk-upload`, form, {
      ...authConfig(),
      headers: { ...authConfig().headers, "Content-Type": "multipart/form-data" },
    });
  },
  studentReport: (id) => axios.get(`${API}/portal/students/${id}/report`, authConfig()),
  studentReportCard: (id) => axios.get(`${API}/portal/students/${id}/report-card`, authConfig()),

  // Dashboard
  dashboard: () => axios.get(`${API}/portal/dashboard`, authConfig()),

  // Attendance
  saveAttendance: (data) => axios.post(`${API}/portal/attendance`, data, authConfig()),
  getAttendance: (date, batchId) => {
    const params = { date };
    if (batchId) params.batch_id = batchId;
    return axios.get(`${API}/portal/attendance`, { ...authConfig(), params });
  },
  studentAttendance: (id) => axios.get(`${API}/portal/attendance/student/${id}`, authConfig()),
  studentMonthlyGraph: (id) => axios.get(`${API}/portal/attendance/student/${id}/monthly-graph`, authConfig()),
  batchCalendar: (batchId, month) => axios.get(`${API}/portal/attendance/batch-calendar/${batchId}`, { ...authConfig(), params: { month } }),

  // Payments / Fees
  recordPayment: (data) => axios.post(`${API}/portal/payments`, data, authConfig()),
  updatePayment: (id, data) => axios.put(`${API}/portal/payments/${id}`, data, authConfig()),
  deletePayment: (id) => axios.delete(`${API}/portal/payments/${id}`, authConfig()),
  studentPayments: (id) => axios.get(`${API}/portal/payments/student/${id}`, authConfig()),
  feesSummary: () => axios.get(`${API}/portal/fees/summary`, authConfig()),
  feeReminder: (id) => axios.get(`${API}/portal/fees/reminder/${id}`, authConfig()),
  feeReminderCard: (id) => axios.get(`${API}/portal/fees/reminder-card/${id}`, authConfig()),

  // Tests / Performance
  addTest: (data) => axios.post(`${API}/portal/tests`, data, authConfig()),
  studentTests: (id) => axios.get(`${API}/portal/tests/student/${id}`, authConfig()),
  updateTest: (id, data) => axios.put(`${API}/portal/tests/${id}`, data, authConfig()),
  deleteTest: (id) => axios.delete(`${API}/portal/tests/${id}`, authConfig()),
  uploadAttachment: (testId, file) => {
    const form = new FormData();
    form.append("file", file);
    return axios.post(`${API}/portal/tests/${testId}/attachment`, form, {
      ...authConfig(),
      headers: { ...authConfig().headers, "Content-Type": "multipart/form-data" },
    });
  },
  leaderboard: (testName, batchId) => {
    const params = { test_name: testName };
    if (batchId) params.batch_id = batchId;
    return axios.get(`${API}/portal/tests/leaderboard`, { ...authConfig(), params });
  },

  // Communications
  broadcast: (data) => axios.post(`${API}/portal/communications/broadcast`, data, authConfig()),
  commHistory: () => axios.get(`${API}/portal/communications/history`, authConfig()),
  birthdays: () => axios.get(`${API}/portal/communications/birthdays`, authConfig()),

  // Tournaments
  listTournaments: () => axios.get(`${API}/portal/tournaments`, authConfig()),
  createTournament: (data) => axios.post(`${API}/portal/tournaments`, data, authConfig()),
  updateTournament: (id, data) => axios.put(`${API}/portal/tournaments/${id}`, data, authConfig()),
  deleteTournament: (id) => axios.delete(`${API}/portal/tournaments/${id}`, authConfig()),
  recordTournamentScores: (id, scores) => axios.post(`${API}/portal/tournaments/${id}/scores`, { scores }, authConfig()),
  getTournamentScores: (id) => axios.get(`${API}/portal/tournaments/${id}/scores`, authConfig()),

  // Auth
  checkAuth: () => axios.get(`${API}/auth/me`, authConfig()),
  logout: () => axios.post(`${API}/auth/logout`, {}, { withCredentials: true }),
};

export { API };
