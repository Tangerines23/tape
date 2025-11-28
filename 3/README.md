# 고속 테이핑 헤드 성능 검증용 테스트 키트 개발 - 완료보고 발표자료

## 파일 구조

```
FINAL/
├── index.html          # 발표자료 메인 HTML 파일
├── presentation.css    # 발표자료 스타일
├── presentation.js     # 발표자료 네비게이션 스크립트
├── custom_styles.css   # 커스텀 스타일
├── images/             # 이미지 및 비디오 파일 폴더
│   ├── system_overview.jpg    # [사진 1] 전체 시스템 외관
│   ├── control_panel.jpg      # [사진 2] 제어반 내부
│   ├── drive_unit.jpg         # [사진 3] 구동부 상세
│   ├── hmi_operation.jpg       # [사진 4] 메인 운전 화면
│   ├── hmi_monitoring.jpg     # [사진 5] 상태 모니터링 화면
│   └── demo_video.mp4         # 시연 영상 (약 1분 내외)
└── README.md          # 이 파일
```

## 사용 방법

1. **브라우저에서 열기**: `index.html` 파일을 웹 브라우저로 열어주세요.

2. **슬라이드 네비게이션**:
   - 화살표 키 (← →) 또는 스페이스바로 다음/이전 슬라이드 이동
   - 하단 네비게이션 바에서 슬라이드 번호 클릭 시 슬라이드 목록 표시
   - 마우스 휠로도 슬라이드 이동 가능

## 이미지 및 비디오 추가 방법

### 필요한 이미지 파일

다음 이미지 파일들을 `images/` 폴더에 추가해주세요:

1. **system_overview.jpg** - 전체 시스템 외관 사진
   - 알루미늄 프로파일 프레임 및 EtherCAT 기반 서보 시스템이 구축된 테스트 베드 전경

2. **control_panel.jpg** - 제어반 내부 사진
   - LS XGI-CPUE PLC와 iX7NH 서보 드라이버 2축 배치
   - EtherCAT 통신 케이블(LAN)과 입출력 단자대(Xgital IO)가 정리된 모습

3. **drive_unit.jpg** - 구동부 상세 사진
   - 서보모터 축과 테이핑 헤드가 커플링으로 체결된 모습

4. **hmi_operation.jpg** - 메인 운전 화면 스크린샷
   - System Start/Stop 버튼 및 Clamp/Unclamp 버튼이 보이는 화면

5. **hmi_monitoring.jpg** - 상태 모니터링 화면 스크린샷
   - Alarm Monitor 및 I/O Check 화면

### 비디오 파일

6. **demo_video.mp4** - 시연 영상 (약 1분 내외)
   - System Start → 저속 → 가속 → 고속 → Emergency Stop 시연 영상

### 파일 형식 권장사항

- **이미지**: JPG 또는 PNG 형식 권장
- **비디오**: MP4 형식 권장 (H.264 코덱)
- 이미지가 없으면 자동으로 placeholder 텍스트가 표시됩니다.

## 발표자료 구성

1. 표지
2. 개발 배경 및 필요성
3. 프로젝트 목표
4. 시스템 설계
   - 전체 시스템 구성도
   - 핵심 기술 선정
5. 제작 결과 및 구현
   - 하드웨어 제작 결과
   - 소프트웨어(HMI) 구현 결과
6. 최종 시연
7. 주차별 추진 일정
8. 프로젝트 수행 결과 요약
9. 결론 및 기대 효과
10. Q&A

## 기술 스택

- HTML5
- CSS3 (Tailwind CSS)
- JavaScript (GSAP 애니메이션)
- Lucide Icons

## 참고사항

- 모든 이미지와 비디오는 `images/` 폴더에 저장되어야 합니다.
- 파일명은 정확히 위에 명시된 이름과 일치해야 합니다.
- 이미지가 없어도 발표자료는 정상적으로 작동하며, placeholder 텍스트가 표시됩니다.

