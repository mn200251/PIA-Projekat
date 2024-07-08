export class User{
    username: string = ""
    password: string = ""
    forename: string = ""
    surname: string = ""
    sex: string = ""
    type: string = ""
    address: string = ""
    email: string = ""
    contactPhone: number | null = null
    securityQuestion: string = ""
    securityAnswer: string = ""
    profilePicture: any = null
    creditCardNumber: number = 0

    worksAt: string = ""
    accountStatus: number = 0
    // 0  - requested
    // 1  - accepted
    // -1 - rejected
    // -2 - banned

}