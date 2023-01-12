interface Accept {
    message: string;
    status: number;
    correct: boolean;
}
interface returnResponse {
    message: "success" | "failed";
    data?: number;
}
