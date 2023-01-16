
export const validateMail = (email: string): boolean => {
    const tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (!email) return false;
    const emailParts: Array<string> = email.split('@');
    if(emailParts.length !== 2) return false

    const account: string = emailParts[0];
    const address: string = emailParts[1];

    if(account.length > 64) return false
    else if(address.length > 255) return false

    const domainParts: Array<string> = address.split('.');
    if (domainParts.some((part) => {
        return part.length > 63;
    })) return false;

    if (!tester.test(email)) return false;
    return true;
};

export const validatePassword = (password: string): boolean => {
    const tester = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!tester.test(password)) {
        return false;
    }
    return true
}
