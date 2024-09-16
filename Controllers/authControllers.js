
export const demo = async (req , res ) => {
    try{
        return res.status(200).json({success : true , message :'hello there'})
    }catch(error){
        console.log(error)
    }
} 