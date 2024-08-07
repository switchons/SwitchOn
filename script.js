document.getElementById('start-button').addEventListener('click', () => {
    const userName = document.getElementById('user-name').value;
    if (userName) {
        localStorage.setItem('userName', userName);
        document.getElementById('user-greeting').textContent = `${userName}님의 식단 계획`;
        document.getElementById('user-info').style.display = 'none';
        document.getElementById('meal-plan').style.display = 'block';
        updateUserInfo();
    } else {
        alert('사용자 이름을 입력해주세요.');
    }
});

document.querySelectorAll('.meal-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        localStorage.setItem(checkbox.getAttribute('data-meal'), checkbox.checked);
    });
});

function updateUserInfo() {
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.getElementById('user-greeting').textContent = `${userName}님의 식단 계획`;
        document.getElementById('user-info').style.display = 'none';
        document.getElementById('meal-plan').style.display = 'block';

        document.querySelectorAll('.meal-checkbox').forEach(checkbox => {
            const meal = checkbox.getAttribute('data-meal');
            checkbox.checked = localStorage.getItem(meal) === 'true';
        });
    }
}

document.addEventListener('DOMContentLoaded', updateUserInfo);
