// Bài 1: tìm kiếm sản phẩm
(function(){
  const list=document.getElementById("productList"); if(!list) return;
  const input=document.getElementById("search"), msg=document.getElementById("msg");
  const products=[{name:"Laptop Dell XPS 13",price:28000000},{name:"Điện thoại iPhone 15",price:22000000},{name:"Tai nghe Sony WH-1000XM5",price:7500000},{name:"Bàn phím cơ Keychron K2",price:2200000},{name:"Chuột Logitech MX Master 3",price:2500000},{name:"Màn hình LG 27 inch",price:5600000}];
  function render(items){
    list.textContent=""; msg.textContent="";
    if(!items.length){ msg.textContent="Không tìm thấy sản phẩm phù hợp."; return; }
    items.forEach(p=>{
      const c=document.createElement("article"); c.className="card";
      const h=document.createElement("h3"); h.textContent=p.name;
      const pr=document.createElement("p"); pr.textContent=p.price.toLocaleString("vi-VN")+" ₫";
      c.append(h,pr); list.append(c);
    });
  }
  input.addEventListener("input",()=>{
    const k=input.value.trim().toLowerCase();
    render(products.filter(p=>p.name.toLowerCase().includes(k)));
  });
  render(products);
})();

// Bài 2: form đăng ký
(function(){
  const f=document.getElementById("regForm"); if(!f) return;
  const out=document.getElementById("formMsg");
  async function sha256(s){
    const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));
    return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("");
  }
  f.addEventListener("submit",async e=>{
    e.preventDefault();
    const el=f.elements, name=el.fullname.value.trim(), email=el.email.value.trim(), pw=el.password.value, errs=[];
    if(!name) errs.push("Vui lòng nhập tên.");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.push("Email không hợp lệ.");
    if(pw.length<8||!/[A-Z]/.test(pw)||!/[a-z]/.test(pw)||!/\d/.test(pw)) errs.push("Mật khẩu tối thiểu 8 ký tự, có chữ hoa, chữ thường và số.");
    if(!el.agree.checked) errs.push("Bạn cần đồng ý điều khoản.");
    if(errs.length){ out.className="error"; out.textContent=errs.join(" "); return; }
    try{
      const users=JSON.parse(localStorage.getItem("users")||"[]");
      users.push({name,email,passwordHash:await sha256(pw)});
      localStorage.setItem("users",JSON.stringify(users));
      out.className="ok"; out.textContent="Đăng ký thành công!"; f.reset();
    }catch(err){ out.className="error"; out.textContent="Không thể lưu dữ liệu: "+err.message; }
  });
})();

// Bài 3: đồng hồ đếm ngược 10 phút
(function(){
  const disp=document.getElementById("time"); if(!disp) return;
  const modal=document.getElementById("modal"), TOTAL=600;
  let timer=null, end=0;
  function show(s){
    disp.textContent=String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
    disp.classList.toggle("warn",s>0&&s<60);
  }
  function stop(){ clearInterval(timer); timer=null; }
  function tick(){
    const left=Math.max(0,Math.round((end-Date.now())/1000));
    show(left);
    if(left===0){ stop(); modal.hidden=false; }
  }
  document.getElementById("start").addEventListener("click",()=>{ stop(); end=Date.now()+TOTAL*1000; tick(); timer=setInterval(tick,250); });
  document.getElementById("reset").addEventListener("click",()=>{ stop(); show(TOTAL); });
  document.getElementById("close").addEventListener("click",()=>{ modal.hidden=true; });
  window.addEventListener("beforeunload",stop);
})();
