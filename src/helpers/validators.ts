/**
 * @param {String} email 
 * @returns {Boolean} - True if email is valid, false otherwise
 */
export const validateMail = (email: string): boolean => {
    const tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (!email) return false;
    const emailParts: Array<string> = email.split('@');
    if(emailParts.length !== 2) return false

    var account: string = emailParts[0];
    var address: string = emailParts[1];

    if(account.length > 64) return false
    else if(address.length > 255) return false

    const domainParts: Array<string> = address.split('.');
    if (domainParts.some((part) => {
        return part.length > 63;
    })) return false;

    if (!tester.test(email)) return false;
    return true;
};

/**
 * 
 * @param {String} password 
 * @returns {Boolean} - True if password is valid, false otherwise
 */
export const validatePassword = (password: string): boolean => {
    if (password.length < 8)      return false
    if (password.length > 32)     return false
    if (!password.match(/[0-9]/)) return false
    if (!password.match(/[a-z]/)) return false
    if (!password.match(/[A-Z]/)) return false
    return true
}
