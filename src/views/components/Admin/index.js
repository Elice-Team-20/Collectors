export const ItemInputForm = () => {
  return `
    <form class="item-form" enctype="multipart/form-data">
    <div class="form-sector">
      <!-- 제품 이름 -->
      <div class="field" id="itemNameInputDiv">
        <label class="label" for="itemNameInput">제품 이름</label>
        <div class="control">
          <input
            class="input"
            id="itemNameInput"
            type="text"
            placeholder="아이언맨 수트"
            autocomplete="off"
          />
        </div>
      </div>
      <!-- 카테고리 -->
      <div class="field" id="categorySelectorDiv">
        <label class="label" for="categorySelector">카테고리</label>
        <div class="control">
          <select id="categorySelector">
            <option selected disabled>카테고리를 선택해주세요.</option>
            <option value="hero">히어로</option>
            <option value="villain">빌런</option>
          </select>
        </div>
      </div>
      <!-- 제조사 -->
      <div class="field" id="companyInputDiv">
        <label class="label" for="companyInput">제조사</label>
        <div class="control">
          <input
            class="input"
            id="companyInput"
            type="text"
            placeholder="Stark Industry"
            autocomplete="off"
          />
        </div>
      </div>
      <!-- 요약 설명 -->
      <div class="field" id="summaryInputDiv">
        <label class="label" for="summaryInput">요약 설명</label>
        <div class="control">
          <textarea id="summaryInput" cols="40" rows="5"></textarea>
        </div>
      </div>
      <!-- 상세 설명 -->
      <div class="field" id="mainExlainInputDiv">
        <label class="label" for="mainExlainInput">상세 설명</label>
        <div class="control">
          <textarea id="mainExlainInput" cols="40" rows="10"></textarea>
        </div>
      </div>
    </div>
    <div class="form-sector">
      <!-- 제품 사진 -->
      <div class="field" id="imgFileInputDiv">
        <label for="imgFileInput">제품 사진</label>
        <div id="imgFileBox">
          <i class="fa-solid fa-image"></i></div>
        <div class="control">
          <input
            type="file"
            id="imgFileInput"
            name="imgFileInput"
            accept="image/*"
          />
        </div>
      </div>
      <!-- 재고 수 -->
      <div class="field" id="stockInputDiv">
        <label class="label" for="stockInput">재고 수</label>
        <div class="control">
          <input
            class="input"
            id="stockInput"
            type="number"
            placeholder="300"
            autocomplete="off"
          />
        </div>
      </div>
      <!-- 가격 -->
      <div class="field" id="priceInputDiv">
        <label class="label" for="priceInput">가격</label>
        <div class="control">
          <input
            class="input"
            id="priceInput"
            type="number"
            placeholder="50000"
            autocomplete="off"
          />
        </div>
      </div>
      <!-- 검색 키워드 -->
      <div class="field" id="tagInputDiv">
        <label class="label" for="tagInput">검색 키워드</label>
        <div class="control" id="tagTextBtnDiv">
          <input
            class="input"
            id="tagInput"
            type="text"
            placeholder="양자역학"
            autocomplete="off"
          />
          <button id="addTagBtn">추가하기</button>
        </div>
        <div id="tagList"></div>
      </div>
      <!-- 제품 등록하기 버튼 -->
      <button id="registerItemBtn">제품 등록하기</button>
    </div>
  </form>
    `;
};
