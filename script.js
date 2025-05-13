// كلمة سر الإدمن
const ADMIN_PASSWORD = "MBL INFO";

// بيانات المنشورات
let posts = JSON.parse(localStorage.getItem('shadowNetPosts')) || [];

// تحميل المنشورات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', function() {
    displayPosts();
    initParticles();
    
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
    
    // معاينة الصورة
    document.getElementById('postImage')?.addEventListener('input', function() {
        const imageUrl = this.value.trim();
        const preview = document.getElementById('postPreview');
        
        if (imageUrl) {
            preview.innerHTML = `
                <div style="position:relative; padding-top:56.25%; border-radius:8px; overflow:hidden;">
                    <img src="${imageUrl}" alt="معاينة الصورة" 
                         style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;">
                    <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.7); color:white; padding:8px;">
                        معاينة صورة المنشور
                    </div>
                </div>
                <p style="margin-top:8px; text-align:center; font-size:0.9em;">${imageUrl}</p>
            `;
        } else {
            preview.innerHTML = '<p style="color:var(--light-gray); text-align:center;">سيظهر معاينة الصورة هنا</p>';
        }
    });
});

// عرض المنشورات
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

// عرض نافذة الإدمن
function showAdminModal() {
    document.getElementById('adminModal').style.display = 'block';
    document.getElementById('adminControls').style.display = 'none';
    document.getElementById('adminPassword').value = '';
    document.getElementById('loginError').textContent = '';
}

// إغلاق نافذة الإدمن
function closeAdminModal() {
    document.getElementById('adminModal').style.display = 'none';
}

// التحقق من صلاحية الإدمن
function checkAdminAccess() {
    const password = document.getElementById('adminPassword').value;
    const errorElement = document.getElementById('loginError');
    
    if (password === ADMIN_PASSWORD) {
        document.getElementById('adminControls').style.display = 'block';
        errorElement.textContent = '';
    } else {
        errorElement.textContent = 'كلمة السر غير صحيحة!';
        document.getElementById('adminPassword').style.border = '2px solid var(--error-color)';
        setTimeout(() => {
            document.getElementById('adminPassword').style.border = 'none';
        }, 1000);
    }
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
    const originalBtnText = publishBtn.innerHTML;
    
    // عرض مؤشر التقدم
    publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري النشر...';
    publishBtn.disabled = true;
    
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPost = {
        title,
        content,
        image: imageUrl || null,
        date: new Date().toISOString()
    };
    
    posts.push(newPost);
    localStorage.setItem('shadowNetPosts', JSON.stringify(posts));
    
    // تحديث العرض
    displayPosts();
    
    // مسح حقول الإدخال
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    document.getElementById('postImage').value = '';
    document.getElementById('postPreview').innerHTML = '';
    
    // إعادة زر النشر إلى حالته الأصلية
    publishBtn.innerHTML = originalBtnText;
    publishBtn.disabled = false;
    
    showAlert('تم نشر المنشور بنجاح!', 'success');
}

// تنسيق التاريخ
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
}

// عرض رسائل التنبيه
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 500);
    }, 3000);
}

// تأثير الجسيمات للخلفية
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 100;

    // إنشاء الجسيمات
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 1 - 0.5,
            speedY: Math.random() * 1 - 0.5,
            color: `rgba(52, 152, 219, ${Math.random() * 0.5 + 0.1})`
        });
    }

    // رسم الجسيمات
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            // تحريك الجسيمات
            p.x += p.speedX;
            p.y += p.speedY;
            
            // إعادة الجسيمات عند تجاوز الحدود
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
            
            // توصيل الجسيمات القريبة ببعضها
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const distance = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(52, 152, 219, ${1 - distance / 100})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(drawParticles);
    }

    // بدء الحركة
    drawParticles();

    // إعادة ضبط الحجم عند تغيير حجم النافذة
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// تأثير الكتابة الآلية للشعار
document.addEventListener('DOMContentLoaded', function() {
    const heroTitle = document.querySelector('.hero-content h2');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typingEffect = setInterval(() => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typingEffect);
            }
        }, 100);
    }
});
