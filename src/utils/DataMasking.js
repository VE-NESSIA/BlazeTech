const maskData = {

ssn: (ssn) =>{
    if(!ssn || typeof ssn !== 'string') return 'XXX-XX-XXXX';

    const cleaned = ssn.replace(/[^\d]/g, '');
    if(cleaned.length < 4)
        return 'XXX-XX-XXXX';
    return 'XXX-XX-' + cleaned.slice(-4);
},

phone: (phone) =>{ 
    if(!phone || typeof phone !== 'string') return '(***) ***-****';

    const digits = phone.replace(/[^\d]/g,'');
    if (digits.length< 4)
        return '(***) ***-****';
    return `***-***-${digits.slice(-4)}`;
},

email: (email) => {
    if(!email || typeof email !== 'string')
        return '***@***.***';

    const [local, domain] = email.split('@');
    if (!local || !domain) 
        return '***@***.***';

    if(local.length <=2)
        return `***@${domain}`;
},

maskCustomer: (customer) => {
    if(!customer)
        return customer;

    return {
        ...customer,
        ssn: maskData.ssn(customer.ssn),
        phone:maskData.phone(customer.phone),
        email:maskData.email(customer.email)
    };
}
};

export default maskData;