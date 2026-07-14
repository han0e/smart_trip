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
          "https://map.naver.com/p/directions/3znE4J,2AIHVy,%EB%AC%B8%EC%A0%95%EC%97%ADSKV1,1801652647,PLACE_POI/3AwxR6,2AxPJE,%ED%95%98%EC%9D%B4%EC%9B%90%20%EB%A7%8C%ED%95%AD%EA%B3%A4%EB%93%9C%EB%A0%88%EB%8B%AD%EC%A7%91,37165077,PLACE_POI/-/car?c=14.00,0,0,0,dh",
        travelTime: "차로 약 3시간(SKV1 → 만항곤드레닭집)",
      },
      {
        time: "10:40",
        title: "점심 식사 : 만항곤드레닭집",
        desc: "만항곤드레닭집\n(강원 정선군 사북읍 사북1길 7-1)",
        iconName: "Utensils",
        mapQuery: "만항곤드레닭집",
        mapUrl:
          "https://map.naver.com/p/search/만항곤드레닭집/place/15023348?c=15.00,0,0,0,dh",
        routeUrl:
          "https://map.naver.com/p/directions/3AxVVo,2AvvaC,%ED%95%98%EC%9D%B4%EC%9B%90CC,19713785,PLACE_POI/3AwxR6,2AxPJE,%ED%95%98%EC%9D%B4%EC%9B%90%20%EB%A7%8C%ED%95%AD%EA%B3%A4%EB%93%9C%EB%A0%88%EB%8B%AD%EC%A7%91,37165077,PLACE_POI/-/car?c=12.00,0,0,0,dh",
        travelTime: "차로 약 8분(식당 → 하이원CC)",
      },
      {
        time: "12:42",
        title: "하이원CC 티오프 (마운틴코스)",
        desc: "1일차 골프 라운딩\n(강원 정선군 고한읍 고한리 418)",
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
          "https://map.naver.com/p/directions/3AxxQ3,2AvpJC,%ED%95%98%EC%9D%B4%EC%9B%90%EB%A6%AC%EC%A1%B0%ED%8A%B8%20%EB%A7%88%EC%9A%B4%ED%8B%B4%EC%BD%98%EB%8F%84,15796056,PLACE_POI/3Aynco,2AwJxE,%EC%97%B0%ED%83%84%EA%B5%AC%EC%9D%B4%EB%8B%A4%EC%9B%90,37654112,PLACE_POI/-/car?c=13.00,0,0,0,dh",
        travelTime: "차로 약 15분(콘도 → 식당)",
      },
      {
        time: "18:30",
        title: "저녁 식사 : 연탄구이다원",
        desc: "연탄구이다원\n(강원 정선군 고한읍 고한4길 32-1)",
        iconName: "Utensils",
        mapQuery: "연탄구이 다원",
        mapUrl:
          "https://map.naver.com/p/search/%EC%97%B0%ED%83%84%EA%B5%AC%EC%9D%B4%20%EB%8B%A4%EC%9B%90?c=15.00,0,0,0,dh",
        routeUrl:
          "https://map.naver.com/p/directions/3Aynco,2AwJxE,%EC%97%B0%ED%83%84%EA%B5%AC%EC%9D%B4%EB%8B%A4%EC%9B%90,37654112,PLACE_POI/3AxVVo,2AvvaC,%ED%95%98%EC%9D%B4%EC%9B%90%EB%A6%AC%EC%A1%B0%ED%8A%B8%20%EB%A7%88%EC%9A%B4%ED%8B%B4%EC%BD%98%EB%8F%84,15796056,PLACE_POI/-/car?c=13.00,0,0,0,dh",
        travelTime: "차로 약 11분(식당 → 콘도)",
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
        title: "아침 식사 : 엄니밥상",
        desc: "엄니밥상\n(강원 정선군 고한읍 고한로 34)",
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
        desc: "2일차 골프 라운딩\n(강원 정선군 고한읍 고한리 418)",
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
        title: "점심 식사 : 정선메밀촌막국수",
        desc: "정선메밀촌막국수\n(강원 정선군 고한읍 고한로 79)",
        iconName: "Utensils",
        mapQuery: "정선메밀촌막국수",
        mapUrl:
          "https://map.naver.com/p/search/%EC%A0%95%EC%84%A0%EB%A9%94%EB%B0%80%EC%B4%8C%EB%A7%89%EA%B5%AD%EC%88%98?c=15.00,0,0,0,dh",
        routeUrl:
          "https://map.naver.com/p/directions/3Axxy8,2AvpW6,정선메밀촌막국수,13159981,PLACE_POI/3znE4J,2AIHVy,문정역SKV1,1801652647,PLACE_POI/-/car?c=9.00,0,0,0,dh",
        travelTime: "서울 방향으로 출발",
      },
      {
        time: "16:30 ~ 18:00",
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
