import moment from 'moment';
export default {
    ifequal(a,b,option){
        if(a==b){
            return option.fn(this);
        }

        return option.inverse(this);
    },
    getANameCharacter(firstname,lastname){
        return firstname.charAt(0)+lastname.charAt(0);
    },
    getDate(date){
        return moment(date).format('DD.MMM.YYYY');
    }
}