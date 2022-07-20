import { BadRequestException } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { createCipheriv } from "crypto";



export class Utils {

    private static instance: Utils
    public static getInstance(): Utils {
        if (!Utils.instance) {
            Utils.instance = new Utils()
        }
        return Utils.instance
    }

    getCurrentDate(): string {

        let currentDate = new Date();
        let date = this.getFillNumber(currentDate.getDate())
        let month = this.getFillNumber((currentDate.getMonth() + 1))
        let year = currentDate.getFullYear();
        let hours = this.getFillNumber(currentDate.getHours());
        let minutes = this.getFillNumber(currentDate.getMinutes())
        let seconds = this.getFillNumber(currentDate.getSeconds())

        return `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`

    }

    getFillNumber(value: number) {
        return `0${value}`.slice(-2)
    }

    getValidName(name: string) {

        let currentName = name.toUpperCase()

        currentName = currentName.replace(/\s+/g, " ")

        if (this.validateUser(/[!@#$%^&*(),.?":{}|<>]/g, currentName)) {
            throw new BadRequestException('O nome não pode conter caracteres especiais!!')
        }

        return currentName
    }

    private validateUser(regex: RegExp, value: string): boolean {
        return regex.test(value)
    }

    async encryptPassword(pass: string): Promise<string> {
        const saltOrRounds = 10;
        return bcrypt.hash(pass, saltOrRounds)

    }

    getFormatedUsDate(date: string) {

        const currentDate = date.split('/')
        const day = currentDate[0]
        const month = currentDate[1]
        const year = currentDate[2]
        return new Date(`${year}/${month}/${day}`)

    }

    getReadingDate(date: string) {

        console.log('Date: ', date);

        const day = date.substring(6)
        const month = date.substring(4, 6)
        const year = date.substring(0, 4)
        return new Date(`${year}/${month}/${day}`)

    }

    async encrypt(password: string): Promise<string> {
        const padSize = 16 - (((password.length + 16 - 1) % 16) + 1)
        const data = String.fromCharCode(padSize)
        const cipher = createCipheriv('aes-128-cbc', 'G!P@4#1$1%M4SC4D', 'C#&UjO){QwzFcsPs')
        cipher.setAutoPadding(false)
        let pass = password + data.repeat(padSize)
        let enc = cipher.update(pass, 'utf8', 'base64')
        return (enc += cipher.final('base64'))
    }


    async compareObjects(first: any, second: any) {

        let fistObject = Object.getOwnPropertyNames(first)
        let secondObject = Object.getOwnPropertyNames(second)

        if (fistObject.length != secondObject.length) {
            return false
        }

        for (const element of fistObject) {

            let propName = element

            if (first[propName] !== second[propName]) {
                return false
            }
        }

        return true
    }


   


}