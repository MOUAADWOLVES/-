// بيانات المنشورات
let posts = [
    {
        title: "أفضل أدوات الأمان الرقمي لعام 2025",
        date: "2025-03-25",
        image: "https://example.com/security-tools.jpg",
        btnText: "تحميل الأدوات",
        btnLink: "https://example.com/download",
        isFeatured: true
    },
    {
        title: "دليل حماية الخصوصية على الإنترنت",
        date: "2025-02-15",
        image: "https://example.com/privacy-guide.jpg",
        btnText: "قراءة الدليل",
        btnLink: "https://example.com/guide",
        isFeatured: true
    }
];

// عرض المنشورات
function displayPosts() {
    const featuredContainer = document.getElementById('featured-posts');
    const thumbnailsContainer = document.getElementById('thumbnails');
    
    // مسح المحتوى الحالي
    featuredContainer.innerHTML = '<h2>مشاركات مميزة</h2>';
    thumbnailsContainer.innerHTML = '';
    
    // عرض المنشورات المميزة
    posts.filter(post => post.isFeatured).forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'featured-post';
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.date}</p>
            <img src="${post.image}" alt="${post.title}" style="max-width: 100%; height: auto;">
            <div class="admin-actions">
                <a href="${post.btnLink}" class="btn">${post.btnText}</a>
            </div>
        `;
        featuredContainer.appendChild(postElement);
    });
    
    // عرض الصور المصغرة
    posts.forEach(post => {
        const thumbnail = document.createElement('img');
        thumbnail.src = post.image;
        thumbnail.alt = post.title;
        thumbnail.onclick = () => {
            // عند النقر على الصورة المصغرة، عرض المنشور الكامل
            window.location.href = post.btnLink;
        };
        thumbnailsContainer.appendChild(thumbnail);
    });
}

// تسجيل دخول الأدمن
function loginAdmin() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    if (username === 'admin' && password === '2023') {
        document.getElementById('admin-actions').style.display = 'block';
        alert('تم تسجيل الدخول بنجاح!');
    } else {
        alert('اسم المستخدم أو كلمة السر غير صحيحة!');
    }
}

// إضافة منشور جديد
function addPost() {
    const title = document.getElementById('post-title').value;
    const image = document.getElementById('post-image').value;
    const btnText = document.getElementById('post-btn-text').value;
    const btnLink = document.getElementById('post-btn-link').value;
    
    if (title && image && btnText && btnLink) {
        const newPost = {
            title,
            date: new Date().toISOString().split('T')[0],
            image,
            btnText,
            btnLink,
            isFeatured: true
        };
        
        posts.unshift(newPost);
        displayPosts();
        
        // مسح حقول الإدخال
        document.getElementById('post-title').value = '';
        document.getElementById('post-image').value = '';
        document.getElementById('post-btn-text').value = '';
        document.getElementById('post-btn-link').value = '';
        
        alert('تمت إضافة المنشور بنجاح!');
    } else {
        alert('الرجاء ملء جميع الحقول!');
    }
}

// البحث في المنشورات
document.querySelector('.search-bar').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const featuredPosts = document.querySelectorAll('.featured-post');
    
    featuredPosts.forEach(post => {
        const title = post.querySelector('h3').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
});

// عرض المنشورات عند تحميل الصفحة
window.onload = displayPosts;
