import strict from "node:assert/strict";
import  slugify  from "slugify";

export const createSlug = (value)=>{
return slugify(value,{
    lower:true,
    strict:true
});
};