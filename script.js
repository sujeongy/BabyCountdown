document.getElementById("dateInput").value = new Date()
  .toISOString()
  .split("T")[0];

const lastDate = document.querySelector("#lastDate");
const cycleInput = document.querySelector("#cycleInput");
const dateInput = document.querySelector("#dateInput");
const referenceDateInput = document.querySelector("#referenceDate");
const guideText = document.querySelector("#guideText");
const resultBox = document.querySelector("#resultBox");

function resetInput() {
  lastDate.value = 0;
  cycleInput.value = 30;
  dateInput.value = new Date().toISOString().split("T")[0];
  resultBox.style.display = "none";
  guideText.style.display = "block";
}

function calculatePregnancy(lmp, cycle, referenceDate = new Date()) {
  const lastMenstrualDate = new Date(lmp);
  const refDate = new Date(referenceDate);

  // 생리 주기에 따라 보정된 LMP
  const adjustedLMP = new Date(lastMenstrualDate);
  adjustedLMP.setDate(adjustedLMP.getDate() + (cycle - 28));

  // 임신 주차 계산 (보정된 LMP 반영)
  const diffTime = refDate.getTime() - adjustedLMP.getTime();
  const weeks = diffTime / (1000 * 60 * 60 * 24 * 7);
  const fullWeeks = Math.floor(weeks);
  const days = Math.round((weeks - fullWeeks) * 7);

  // 생리 주기에 맞춘 배란일 조정
  const ovulationDate = new Date(lastMenstrualDate);
  ovulationDate.setDate(ovulationDate.getDate() + (cycle - 14));

  // 출산 예정일 (보정된 주기 반영)
  const dueDate = new Date(lastMenstrualDate);
  dueDate.setDate(dueDate.getDate() + 280 + (cycle - 28));

  return {
    pregnancyWeeks: `${fullWeeks}주 ${days}일`,
    ovulationDate: ovulationDate.toISOString().split("T")[0],
    dueDate: dueDate.toISOString().split("T")[0],
  };
}

function getResult() {
  const date1 = new Date(lastDate.value).getTime();
  const date2 = new Date(dateInput.value).getTime();

  if (!lastDate.value) {
    return alert("마지막 생리 시작일을 선택해주세요!");
  } else if (!cycleInput.value) {
    return alert("생리 주기를 입력해주세요!");
  } else if (!dateInput.value) {
    return alert("기준일을 선택해주세요!");
  } else if (date1 > date2) {
    return alert(
      "마지막 생리 시작일이 기준일보다 이전 날짜로 선택되어야 합니다!"
    );
  } else if (cycleInput.value > 100) {
    return alert("주기가 너무 길면 병원에 방문하시는 것을 추천드립니다.");
  }

  referenceDateInput.innerHTML = dateInput.value;
  const resultInput1 = document.querySelector("#result1");
  const resultInput2 = document.querySelector("#result2");
  const resultInput3 = document.querySelector("#result3");
  const { pregnancyWeeks, ovulationDate, dueDate } = calculatePregnancy(
    lastDate.value,
    cycleInput.value,
    dateInput.value
  );
  resultInput1.innerHTML = pregnancyWeeks;
  resultInput2.innerHTML = ovulationDate;
  resultInput3.innerHTML = dueDate;
  resultBox.style.display = "flex";
  guideText.style.display = "none";
}
