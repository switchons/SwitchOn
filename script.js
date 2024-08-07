document.getElementById('start-button').addEventListener('click', () => {
    const userName = document.getElementById('user-name').value;
    const startDate = document.getElementById('start-date').value;
    if (userName && startDate) {
        localStorage.setItem('userName', userName);
        localStorage.setItem('startDate', startDate);
        document.getElementById('user-greeting').textContent = `${userName}님의 4주 다이어트 식단 계획`;
        document.getElementById('user-info').style.display = 'none';
        document.getElementById('calendar').style.display = 'block';
        generateCalendar(new Date(startDate));
        updateUserInfo();
    } else {
        alert('사용자 이름과 시작일을 입력해주세요.');
    }
});

function generateCalendar(startDate) {
    const weeksContainer = document.getElementById('weeks-container');
    weeksContainer.innerHTML = ''; // 기존 내용 삭제
    for (let week = 0; week < 4; week++) {
        const weekDiv = document.createElement('div');
        weekDiv.className = 'week';
        weekDiv.innerHTML = `<h3>${week + 1}주차</h3>`;
        for (let day = 0; day < 7; day++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + (week * 7) + day);
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.innerHTML = `
                <h4>${currentDate.toLocaleDateString()} - ${week * 7 + day + 1}일차</h4>
                <div class="meal-section">
                    <h5>아침</h5>
                    <label><input type="checkbox" class="meal-checkbox" data-meal="week${week + 1}-day${day + 1}-breakfast1"> 식단 1</label>
                </div>
                <div class="meal-section">
                    <h5>점심</h5>
                    <label><input type="checkbox" class="meal-checkbox" data-meal="week${week + 1}-day${day + 1}-lunch1"> 식단 1</label>
                </div>
                <div class="meal-section">
                    <h5>저녁</h5>
                    <label><input type="checkbox" class="meal-checkbox" data-meal="week${week + 1}-day${day + 1}-dinner1"> 식단 1</label>
                </div>
            `;
            weekDiv.appendChild(dayDiv);
        }
        weeksContainer.appendChild(weekDiv);
    }

    // 체크박스 이벤트 리스너 다시 설정
    document.querySelectorAll('.meal-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            localStorage.setItem(checkbox.getAttribute('data-meal'), checkbox.checked);
        });
    });

    updateUserInfo(); // 기존 상태 업데이트
}

function updateUserInfo() {
    const userName = localStorage.getItem('userName');
    const startDate = new Date(localStorage.getItem('startDate'));
    if (userName && startDate) {
        document.getElementById('user-greeting').textContent = `${userName}님의 4주 다이어트 식단 계획`;
        document.getElementById('user-info').style.display = 'none';
        document.getElementById('calendar').style.display = 'block';

        generateCalendar(startDate);

        document.querySelectorAll('.meal-checkbox').forEach(checkbox => {
            const meal = checkbox.getAttribute('data-meal');
            checkbox.checked = localStorage.getItem(meal) === 'true';
        });
    }
}

document.addEventListener('DOMContentLoaded', updateUserInfo);
