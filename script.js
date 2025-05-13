// كلمة سر الإدمن
const ADMIN_PASSWORD = "MBL INFO";

// بيانات المنشورات (سيتم تخزينها في localStorage)
let posts = JSON.parse(localStorage.getItem('shadowNetPosts')) || [];

// تحميل المنشورات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('admin.html')) {
        // إذا كنا في صفحة الإدمن
        const loginContainer = document.getElementById('loginContainer');
        const adminDashboard = document.getElementById('adminDashboard');
        
        // التحقق إذا كان المستخدم مسجل الدخول بالفعل
        if (localStorage.getItem('adminLoggedIn') === 'true') {
            loginContainer.style.display = 'none';
            adminDashboard.style.display = 'block';
            loadAdminPosts();
        }
    } else {
        // إذا كنا في الصفحة الرئيسية
        displayPosts();
        initParticles();
    }
    
    // تأثيرات التمرير للهيدر
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.backgroundColor = 'rgba(44, 62, 80, 0.9)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
            header.style.backdropFilter = 'none';
            header.style.backgroundColor = '';
        }
    });
});

// عرض المنشورات في الصفحة الرئيسية
function displayPosts() {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';
    
    if (posts.length === 0) {
        postsContainer.innerHTML = '<p class="no-posts">لا توجد منشورات متاحة حالياً.</p>';
        return;
    }
    
    // عرض أحدث المنشورات أولاً
    const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedPosts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        postElement.style.animationDelay = `${index * 0.1}s`;
        
        postElement.innerHTML = `
            ${post.image ? `<img src="${post.image}" alt="${post.title}" class="post-image">` : ''}
            <div class="post-content">
                <h3 class="post-title">${post.title}</h3>
                <span class="post-date">${formatDate(post.date)}</span>
                <p>${post.content}</p>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

// التحقق من كلمة سر الإدمن
function checkAdminPassword() {
    const password = document.getElementById('adminPassword').value;
    const errorElement = document.getElementById('loginError');
    
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('adminLoggedIn', 'true');
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        setTimeout(() => {
            document.getElementById('adminDashboard').classList.add('show');
        }, 10);
        loadAdminPosts();
    } else {
        errorElement.textContent = 'كلمة السر غير صحيحة!';
        document.getElementById('adminPassword').style.border = '2px solid var(--error-color)';
        setTimeout(() => {
            document.getElementById('adminPassword').style.border = 'none';
        }, 1000);
    }
}

// تسجيل خروج الإدمن
function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'admin.html';
}

// نشر منشور جديد
async function publishPost() {
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const imageUrl = document.getElementById('postImage').value.trim();
    
    if (!title || !content) {
        showAlert('الرجاء إدخال عنوان ومحتوى للمنشور', 'error');
        return;
    }
    
    const publishBtn = document.querySelector('.publish-btn');
    const originalBtnText = publishBtn.textContent;
    
    // عرض مؤشر التقدم
    publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري النشر...';
    publishBtn.disabled = true;
    
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPost = {
        title,
        content,
        image: imageUrl || null,
        date: new Date().toISOString()
    };
    
    posts.push(newPost);
