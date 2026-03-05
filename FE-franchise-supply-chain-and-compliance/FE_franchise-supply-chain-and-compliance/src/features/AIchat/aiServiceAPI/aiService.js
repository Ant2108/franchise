import apiClient from "../../../services/axiosClient";
const AIServiceAPI = {
    sendMessage: (message) => {
        return apiClient.post('/chat', { message });
    },
    // getChatHistory: (conversationId) => {
    //     return apiClient.get(`/ai-chat/history/${conversationId}`);
    // }
};
export default AIServiceAPI;