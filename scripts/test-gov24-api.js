// 정부24 API 테스트 스크립트
const fetch = require('node-fetch');

async function testGov24API() {
  try {
    // 정부24 지원금 목록 API 시도
    const urls = [
      'https://www.gov.kr/portal/rcvfvrSvc/svcFind/list.json',
      'https://www.gov.kr/portal/rcvfvrSvc/main/list.json',
      'https://www.gov.kr/portal/rcvfvrSvc/svcFind/signgu/list.json?srchType=sido&sidoCode=',
    ];

    for (const url of urls) {
      try {
        console.log(`\n테스트: ${url}`);
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('성공:', JSON.stringify(data, null, 2).substring(0, 500));
        } else {
          console.log('실패:', response.status, response.statusText);
        }
      } catch (error) {
        console.log('오류:', error.message);
      }
    }
  } catch (error) {
    console.error('전체 오류:', error);
  }
}

testGov24API();

