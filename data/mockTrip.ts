import { DayItinerary, CostItem } from "@/types/itinerary";

export const mockCosts: CostItem[] = [
  { item: "그린피 (7/15)", price: "200,000", note: "마운틴코스" },
  { item: "그린피 (7/16)", price: "200,000", note: "마운틴코스" },
  { item: "콘도 숙박비", price: "250,000", note: "마운틴플러스콘도 60평" },
  { item: "식비", price: "300,000", note: "중식, 석식, 조식 포함 예상" },
  { item: "카트비/캐디피", price: "200,000", note: "2일간 비용" },
  { item: "기타 비용", price: "50,000", note: "간식 및 음료" },
  { item: "합계", price: "", note: "", isTotal: true },
  { item: "인당비용", price: "", note: "", isPerPerson: true },
];

export const mockItinerary: DayItinerary[] = [
  {
    id: "day1",
    title: "1일차",
    date: "7월 15일 (수) — 행사 1일차",
    schedules: [
      {
        time: "07:30",
        title: "문정동 SK V1 주차장 집결",
        desc: "참석자 집결 후 차량(카풀)으로 하이원CC로 출발\n(참석자 : 정선호, 김지복, 정인수, 장대진)",
        iconName: "Car",
        mapQuery: "문정역2차SKV1",
        mapUrl:
          "https://map.naver.com/p/search/문정역SKV1/place/1801652647?c=15.00,0,0,0,dh",
        routeUrl:
          "https://map.naver.com/p/directions/3znE4J,2AIHVy,문정역SKV1,1801652647,PLACE_POI/3AxVVo,2AvvaC,하이원CC,19713785,PLACE_POI/-/car?c=9.00,0,0,0,dh",
        travelTime: "차로 약 3시간",
      },
      {
        time: "11:00",
        title: "하이원CC 도착 및 중식",
        desc: "하이원CC 클럽하우스 또는 인근 식당에서 점심식사 (식당 미정)",
        iconName: "Utensils",
        mapQuery: "하이원CC",
        mapUrl:
          "https://map.naver.com/p/search/하이원CC/place/19713785?c=15.00,0,0,0,dh",
        routeUrl:
          "https://map.naver.com/p/search/하이원CC/place/19713785?c=15.00,0,0,0,dh",
        travelTime: "라운딩 준비",
      },
      {
        time: "12:42",
        title: "하이원CC 티오프 (마운틴코스)",
        desc: "1일차 골프 라운딩 (강원 정선군 고한읍 고한리 418)",
        iconName: "Flag",
        mapQuery: "하이원CC",
        mapUrl:
          "https://map.naver.com/p/search/하이원CC/place/19713785?c=15.00,0,0,0,dh",
        routeUrl:
          "https://map.naver.com/p/directions/3AxVVo,2AvvaC,하이원CC,19713785,PLACE_POI/3AxxQ3,2AvpJC,하이원리조트%20마운틴콘도,15796056,PLACE_POI/-/car?c=13.00,0,0,0,dh",
        travelTime: "라운딩 종료 후 콘도로 이동 (차로 약 20분)",
      },
      {
        time: "18:00",
        title: "하이원리조트 마운틴플러스콘도 체크인",
        desc: "마운틴플러스콘도 60평 체크인 (조식 포함)\n(강원 정선군 고한읍 하이원길 265-1)",
        iconName: "Hotel",
        mapQuery: "하이원리조트 마운틴콘도",
        mapUrl:
          "https://map.naver.com/p/search/하이원리조트%20마운틴콘도/place/15796056?c=15.00,0,0,0,dh",
        routeUrl:
          "https://map.naver.com/p/directions/3AxxQ3,2AvpJC,%ED%95%98%EC%9D%B4%EC%9B%90%EB%A6%AC%EC%A1%B0%ED%8A%B8%20%EB%A7%88%EC%9A%B4%ED%8B%B4%EC%BD%98%EB%8F%84,15796056,PLACE_POI/3AxxDQ,2Axw2N,%EC%B4%88%EC%9B%90%EC%A0%95%EC%9C%A1%EC%A0%90%EC%8B%9D%EB%8B%B9,624295664,PLACE_POI/-/car?c=13.00,0,0,0,dh",
        travelTime: "차로 약 10분",
      },
      {
        time: "18:30",
        title: "저녁 식사: 초원정육점식당 (미정)",
        desc: "한우 및 삼겹살 등으로 저녁 식사 및 화합의 시간\n(강원 정선군 고한읍 지장천로 853)",
        iconName: "Utensils",
        mapQuery: "초원정육점식당",
        mapUrl:
          "https://map.naver.com/p/search/%EC%B4%88%EC%9B%90%EC%A0%95%EC%9C%A1%EC%A0%90%EC%8B%9D%EB%8B%B9/place/624295664?c=15.00,0,0,0,dh&placePath=%2Fhome%3Fbk_query%3D%EC%B4%88%EC%9B%90%EC%A0%95%EC%9C%A1%EC%A0%90%EC%8B%9D%EB%8B%B9%26entry%3Dbmp%26from%3Dmap%26fromPanelNum%3D2%26timestamp%3D202607131200%26locale%3Dko%26svcName%3Dmap_pcv5%26searchText%3D%EC%B4%88%EC%9B%90%EC%A0%95%EC%9C%A1%EC%A0%90%EC%8B%9D%EB%8B%B9",
      },
    ],
  },
  {
    id: "day2",
    title: "2일차",
    date: "7월 16일 (목) — 행사 2일차",
    schedules: [
      {
        time: "05:30",
        title: "기상 후 체크아웃",
        desc: "리조트 기상 후 체크아웃 준비",
        iconName: "BaggageClaim",
        mapQuery: "하이원리조트 마운틴콘도",
        mapUrl: "https://map.naver.com/p/entry/place/15796056?c=15.00,0,0,0,dh",
        routeUrl:
          "https://map.naver.com/p/directions/3Axgf8,2Ax3So,%ED%95%98%EC%9D%B4%EC%9B%90%EB%A6%AC%EC%A1%B0%ED%8A%B8%20%EB%A7%88%EC%9A%B4%ED%8B%B4%EC%BD%98%EB%8F%84,15796056,PLACE_POI/3Axy8V,2AvpW6,%EC%97%84%EB%8B%88%EB%B0%A5%EC%83%81,1443384375,PLACE_POI/-/car?c=13.00,0,0,0,dh",
        travelTime: "차로 약 10분 (콘도 → 엄니밥상 또는 하이원CC)",
      },
      {
        time: "06:30",
        title: "조식",
        desc: "클럽하우스 또는 엄니밥상(백반정식)\n(강원 정선군 고한읍 고한로 34 엄니밥상)",
        iconName: "Utensils",
        mapQuery: "엄니밥상",
        mapUrl:
          "https://map.naver.com/p/search/엄니밥상/place/1443384375?c=15.00,0,0,0,dh",
        routeUrl:
          "https://map.naver.com/p/directions/3AxVVo,2AvvaC,%EC%97%84%EB%8B%88%EB%B0%A5%EC%83%81,1443384375,PLACE_POI/3Axy8V,2AvpW6,%ED%95%98%EC%9D%B4%EC%9B%90CC,PLACE_POI/-/car?c=13.00,0,0,0,dh",
        travelTime: "차로 약 10분 (엄니밥상 → 하이원CC)",
      },
      {
        time: "07:55",
        title: "하이원CC 티오프 (마운틴코스)",
        desc: "2일차 골프 라운딩 (강원 정선군 고한읍 고한리 418)",
        iconName: "Flag",
        mapQuery: "하이원CC",
        mapUrl:
          "https://map.naver.com/p/search/하이원CC/place/19713785?c=15.00,0,0,0,dh",
        routeUrl:
          "https://map.naver.com/p/directions/3AxVVo,2AvvaC,%ED%95%98%EC%9D%B4%EC%9B%90CC,19713785,PLACE_POI/3Ay5Hh,2AwU8A,%EC%A0%95%EC%84%A0%EB%A9%94%EB%B0%80%EC%B4%8C%EB%A7%89%EA%B5%AD%EC%88%98,20259750,PLACE_POI/-/car?c=13.00,0,0,0,dh",
        travelTime: "라운딩 종료 후 중식당으로 이동 (차로 약 10분)",
      },
      {
        time: "13:00",
        title: "점심 식사: 정선메밀촌막국수 (미정)",
        desc: "막국수 및 감자전 등으로 점심 식사\n(강원 정선군 고한읍 고한로 79)",
        iconName: "Utensils",
        mapQuery: "정선메밀촌막국수",
        mapUrl:
          "https://map.naver.com/p/search/강원 정선군 고한읍 고한로 79/place/13159981?c=15.00,0,0,0,dh",
        routeUrl:
          "https://map.naver.com/p/directions/3Axy9V,2AvpgC,강원 정선군 고한읍 고한로 79,13159981,PLACE_POI/3znE4J,2AIHVy,문정역SKV1,1801652647,PLACE_POI/-/car?c=9.00,0,0,0,dh",
        travelTime: "서울 방향으로 출발",
      },
      {
        time: "15:00",
        title: "서울 도착 후 뒷풀이 또는 귀가",
        desc: "서울 도착 후 일정 정리 및 해산",
        iconName: "Car",
        mapQuery: "문정역 2차 SK V1 GL메트로시티",
        mapUrl:
          "https://map.naver.com/p/search/문정역SKV1/place/1801652647?c=15.00,0,0,0,dh",
      },
    ],
  },
];
