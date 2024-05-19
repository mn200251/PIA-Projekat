export class User{
    username: string = ""
    password: string = ""
    forename: string = ""
    surname: string = ""
    sex: string = ""
    type: string = ""
    address: string = ""
    email: string = ""
    contactPhone: string = ""
    securityQuestion: string = ""
    securityAnswer: string = ""
    profilePicure: File | null = null
    creditCardNumber: number = 0

    verified: boolean = false
}