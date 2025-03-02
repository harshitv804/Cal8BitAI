import './Pagination.css'

export default function Pagination({totalPosts, postsPerPage,currentPage,setCurrentPage}){
let pages = [];
for(let i=1;i<=Math.ceil(totalPosts/postsPerPage);i++){
    pages.push(i);
}
return(
    <div className='pagination-btn'>
    {pages.map((page,index)=> {
        return <button key={index} className={currentPage===page? 'active-page':''} onClick={()=>setCurrentPage(page)}>{page}</button>
    })}
    </div>
)
}