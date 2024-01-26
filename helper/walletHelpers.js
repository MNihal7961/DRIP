const wallet=require('../model/walletmodel')
const{ObjectId}=require('mongodb')


const topUpWallet=async(userId,amount)=>{
    try{
        const update=await wallet.updateOne(
            {user:new ObjectId(userId)},
            {
                $inc: { balance: parseInt(amount) },
                $push: {
                  history: {
                    type: "Credited",
                    amount: parseInt(amount),
                    date: new Date(),
                    description: "top up money",
                  },
                },
            }
        )
        if(update){
            return true
        }
    }catch(err){
        console.error(err)
    }
}

module.exports={
    topUpWallet
}