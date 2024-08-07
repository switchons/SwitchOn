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
        weekDiv.id = `week-${week + 1}`;
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
                    ${getMealPlan(week, day, 'breakfast')}
                </div>
                <div class="meal-section">
                    <h5>점심</h5>
                    ${getMealPlan(week, day, 'lunch')}
                </div>
                <div class="meal-section">
                    <h5>저녁간식</h5>
                    ${getMealPlan(week, day, 'dinner_snack')}
                </div>
                <div class="meal-section">
                    <h5>저녁</h5>
                    ${getMealPlan(week, day, 'dinner')}
                </div>
            `;
            weekDiv.appendChild(dayDiv);
        }
        weeksContainer.appendChild(weekDiv);
    }

    // 첫 번째 주차를 기본으로 표시
    document.getElementById('week-1').classList.add('active');
    document.querySelector('.tab-button[data-week="1"]').classList.add('active');

    // 탭 클릭 이벤트 설정
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.week').forEach(week => week.classList.remove('active'));
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.getElementById(`week-${button.getAttribute('data-week')}`).classList.add('active');
            button.classList.add('active');
        });
    });

    // 체크박스 이벤트 리스너 다시 설정
    document.querySelectorAll('.meal-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            localStorage.setItem(checkbox.getAttribute('data-meal'), checkbox.checked);
        });
    });

    updateUserInfo(); // 기존 상태 업데이트
}

function getMealPlan(week, day, meal) {
    if (week === 0 && day <= 2) {
        return `
            <label><input type="checkbox" class="meal-checkbox" data-meal="week${week + 1}-day${day + 1}-${meal}"> 단백질 쉐이크</label>
        `;
    }
    // 나머지 주차 및 일차에 따른 식단 계획을 여기에 추가할 수 있습니다.
    return `
        <label><input type="checkbox" class="meal-checkbox" data-meal="week${week + 1}-day${day + 1}-${meal}"> 기본 식단</label>
    `;
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

document.addEventListener('DOMContentLoaded',
