export  interface roleType{
    id:number,
    name:string
}
export interface roleState {
    data: roleType[] | null;   
    isLoading: boolean;
    error: string | null;      
}