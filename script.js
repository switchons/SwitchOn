document.getElementById('start-button').addEventListener('click', () => {
    const userName = document.getElementById('user-name').value;
    const startDate = document.getElementById('start-date').value;
    if (userName && startDate) {
        localStorage.setItem('userName', userName);
        localStorage.setItem('startDate', startDate);
        document.getElementById('user-greeting').textContent = `${userName}님의 4주 스위치온`;
        document.getElementById('user-info').style.display = 'none';
        document.getElementById('calendar').style.display = 'block';
        generateCalendar(new Date(startDate));
        updateUserInfo();
    } else {
        alert('사용자 이름과 시작일을 입력해주세요.');
    }
});

document.getElementById('reset-button').addEventListener('click', () => {
    localStorage.clear();  // 모든 localStorage 데이터를 삭제
    document.getElementById('user-info').style.display = 'block';
    document.getElementById('calendar').style.display = 'none';
});

function generateCalendar(startDate) {
    const weeksContainer = document.getElementById('weeks-container');
    weeksContainer.innerHTML = ''; // 기존 내용 삭제
    for (let week = 0; week < 4; week++) {
        const weekDiv = document.createElement('div');
        weekDiv.className = 'week';
        weekDiv.id = `week-${week + 1}`;
        if (week === 0) {
            weekDiv.innerHTML = `
                <div class="week-info">
                    <p>배고프면 오이, 두부, 무가당요거트, 녹황색 채소는 허용!</p>
                    <p>하루에 물을 1.5~2L 정도 마시기!</p>
                    <p>아침저녁으로 유산균을 섭취하는 것이 좋아요!</p>
                    <p>최소 6시간 수면을 지키세요.</p>
                    <p>취침 2~4시간 전에 저녁 식사를 마치고, 저녁과 다음날 아침 사이에 12~14시간 공복을 유지하세요.</p>
                    <p>많이 힘들면 바로 4일차로 넘어가세요.</p>
                </div>
                <h3>${week + 1}주차</h3>
            `;
        } else if (week === 1) {
            weekDiv.innerHTML = `
                <div class="week-info">
                    <p>허용식품: 콩, 견과류 한 줌, 블랙커피 (오전 중 한잔)</p>
                    <p>주 1회 간헐적 단식. 탄수화물 제한식: 채소 + 양질의 단백질음식</p>
                    <p>금지음식: 밀가루, 설탕, 과일</p>
                </div>
                <h3>${week + 1}주차</h3>
            `;
        } else {
            weekDiv.innerHTML = `<h3>${week + 1}주차</h3>`;
        }
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
                <div class="fasting-checkbox">
                    <label>
                        <input type="checkbox" class="fasting-checkbox" data-week="${week + 1}" data-day="${day + 1}" data-period="점점"> 단식 - 점점
                    </label>
                    <label>
                        <input type="checkbox" class="fasting-checkbox" data-week="${week + 1}" data-day="${day + 1}" data-period="저저"> 단식 - 저저
                    </label>
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

    // 단식 체크박스 이벤트 리스너 설정
    document.querySelectorAll('.fasting-checkbox input').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const week = checkbox.getAttribute('data-week');
            const day = checkbox.getAttribute('data-day');
            const period = checkbox.getAttribute('data-period');
            handleFastingCheckboxChange(week, day, period, checkbox.checked);
        });
    });
}

function getMealPlan(week, day, meal) {
    if (week === 0 && day <= 2) {
        return `
            <label><input type="checkbox" class="meal-checkbox" data-meal="week${week + 1}-day${day + 1}-${meal}"> 단백질 쉐이크</label>
        `;
    }
    if (week === 0 && day >= 3) {
        if (meal === 'lunch') {
            return `
                <label><input type="checkbox" class="meal-checkbox" data-meal="week${week + 1}-day${day + 1}-${meal}"> 저탄수화물식</label>
            `;
        } else {
            return `
                <label><input type="checkbox" class="meal-checkbox" data-meal="week${week + 1}-day${day + 1}-${meal}"> 단백질 쉐이크</label>
            `;
        }
    }
    if (week === 1) {
        if (meal === 'breakfast' || meal === 'dinner_snack') {
            return `
                <label><input type="checkbox" class="meal-checkbox" data-meal="week${week + 1}-day${day + 1}-${meal}"> 단백질 쉐이크</label>
            `;
        } else if (meal === 'lunch') {
            return `
                <label><input type="checkbox" class="meal-checkbox" data-meal="week${week + 1}-day${day + 1}-${meal}"> 저탄수화물식</label>
            `;
        } else {
            return `
                <label><input type="checkbox" class="meal-checkbox" data-meal="week${week + 1}-day${day + 1}-${meal}"> 탄수화물 제한식</label>
            `;
        }
    }
    // 나머지 주차 및 일차에 따른 식단 계획을 여기에 추가할 수 있습니다.
    return `
        <label><input type="checkbox" class="meal-checkbox" data-meal="week${week + 1}-day${day + 1}-${meal}"> 기본 식단</label>
    `;
}

function handleFastingCheckboxChange(week, day, period, isChecked) {
    const currentDayIndex = (week - 1) * 7 + (day - 1);
    const mealTimes = {
        "점점": ["dinner_snack", "dinner", "breakfast"],
        "저저": ["breakfast", "lunch", "dinner_snack"]
    };

    const mealsToChange = mealTimes[period];
    mealsToChange.forEach((meal, index) => {
        const mealIndex = currentDayIndex + index;
        const mealCheckbox = document.querySelector(`.day:nth-child(${mealIndex + 1}) .meal-section input[data-meal="week${Math.floor(mealIndex / 7) + 1}-day${mealIndex % 7 + 1}-${meal}"]`);
        if (mealCheckbox) {
            mealCheckbox.checked = isChecked;
            localStorage.setItem(mealCheckbox.getAttribute('data-meal'), isChecked);
        }
    });
}

function updateUserInfo() {
    const userName = localStorage.getItem('userName');
    const startDate = new Date(localStorage.getItem('startDate'));
    if (userName && startDate) {
        document.getElementById('user-greeting').textContent = `${userName}님의 4주 스위치온`;
        document.getElementById('user-info').style.display = 'none';
        document.getElementById('calendar').style.display = 'block';

        generateCalendar(startDate);

        document.querySelectorAll('.meal-checkbox').forEach(checkbox => {
            const meal = checkbox.getAttribute('data-meal');
            checkbox.checked = localStorage.getItem(meal) === 'true';
        });

        document.querySelectorAll('.fasting-checkbox input').forEach(checkbox => {
            const week = checkbox.getAttribute('data-week');
            const day = checkbox.getAttribute('data-day');
            const period = checkbox.getAttribute('data-period');
            const isChecked = localStorage.getItem(`fasting-week${week}-day${day}-${period}`) === 'true';
            checkbox.checked = isChecked;
            if (isChecked) {
                handleFastingCheckboxChange(week, day, period, isChecked);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', updateUserInfo);
