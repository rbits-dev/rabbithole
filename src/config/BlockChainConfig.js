 const config = {
    // 97:{
    //     breedingAddress:"0x0cc412631a1aB7c0D7715e1f5E5AC2C6529f1CCB",
    //     ra8BitsToken:"0xae14cdd3824229a57902eeda44106fc7a3b272e9"
    // },
    "prod":{

    },

    "dev":{
        // 11155111:{
        //     breedingAddress:"0x0d675df86d2d13f766f08a78023bcdef5f22ec58",
        //     ra8BitsToken:"0x7C83ACCe4AA3c07c50a922f9Ab907B8D9b917080"
        // },
        84532:{
            breedingAddress:"0x228Bdfa4f7295b47f4Ee1d57601a8e7c6FC2Bed5",
            ra8BitsToken:"0x8Dd1B8a2fbC290bB286D58f241B148b906cCcE67"
        },
    }
   
}

export const blockConfig = config[import.meta.env.VITE_ENV]

