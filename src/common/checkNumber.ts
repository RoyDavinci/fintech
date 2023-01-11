interface Accept {
    message: string;
    status: string;
    correct: boolean;
}

export const checkMobileNumber = (data: string): Accept => {
    const phoneNumberRegex = /^(091|090|081|080|070|071)[0-9]{8}$|^(\+234)[0-9]{10}$/;
    if (!phoneNumberRegex.test(data)) {
        return { message: "invalid phone number", status: "300", correct: false };
    }
    return { message: "success", status: "200", correct: true };
};
