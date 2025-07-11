// const asynchandler=()=>{}

    const asyncHandler=(requestHandler)=>{
        return (req,res,next)=>{
            Promise.resolve(requestHandler(req,res,next))
            .catch((error)=>{
                next(error)
            })
        }
    }

// const asyncHandler=()=>{}
// const asyncHandler=()=>{
//     return ()=>{}
// } 
// const asyncHandler=(fun)=>{
//     return async ()=>{

//     }
// }


// const  asynchandler = (fn) => async (req,res,next)=>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }


export default asyncHandler;