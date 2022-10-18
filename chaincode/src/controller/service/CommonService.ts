export class CommonService {
    public static reduceDateTimeStr(dateref: string, reducing: number): string {
        var reducedDate = new Date(Date.parse(dateref));

        reducedDate = new Date(reducedDate.getTime() - reducing);

        return JSON.parse(JSON.stringify(reducedDate));
    }

    public static reduceDateDaysStr(dateref: string, reducing: number): string {
        var reducedDate = new Date(Date.parse(dateref));

        reducedDate.setDate(reducedDate.getDate() - reducing);

        return JSON.parse(JSON.stringify(reducedDate));
    }

    public static increaseDateDaysStr(dateref: string, increasing: number): string {
        var increasedDate = new Date(Date.parse(dateref));

        increasedDate.setDate(increasedDate.getDate() + increasing);

        return JSON.parse(JSON.stringify(increasedDate));
    }

    public static setHoursStartDayStr(dateref: string): string {
        // params.logger.info("dateref : ", dateref);
        var newDate = new Date(Date.parse(dateref));

        newDate.setUTCHours(0,0,0,0);
        // params.logger.info("newDate : ", newDate);

        return JSON.parse(JSON.stringify(newDate));
    }

    public static setHoursEndDayStr(dateref: string): string {
        // params.logger.info("dateref : ", dateref);
        var newDate = new Date(Date.parse(dateref));

        newDate.setUTCHours(23,59,59,999);
        // params.logger.info("newDate : ", newDate);

        return JSON.parse(JSON.stringify(newDate));
    }



    public static formatDate(dateValue: Date): string {
        var stringValue: string = "";

        // Remember : NaN is never equal to itself.
        if (dateValue && dateValue.getTime() === dateValue.getTime()) {
            var tmp: string = "";
            tmp = dateValue.getFullYear().toString();
            stringValue = stringValue.concat(tmp);

            stringValue = stringValue.concat("-");

            tmp = (dateValue.getMonth()+1).toString();
            stringValue = stringValue.concat(tmp);

            stringValue = stringValue.concat("-");

            tmp = dateValue.getDate().toString();
            stringValue = stringValue.concat(tmp);
        }

        return stringValue;
    }

    public static formatDateStr(dateValueStr: string): string {
        var dateValue = new Date(Date.parse(dateValueStr));

        return this.formatDate(dateValue);
    }



}
