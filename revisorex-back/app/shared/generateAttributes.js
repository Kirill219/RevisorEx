export class generateAttributes {
    static generateCode(title, city, region) {
        return `${title.charAt(0).toUpperCase()}${city.charAt(0).toUpperCase()}${region.charAt(0).toUpperCase()}`;
    }

    static generateInitials(firstName, secondName) {
        return `${secondName.charAt(0).toUpperCase()}${firstName.charAt(0).toUpperCase()}`;
    }
}


