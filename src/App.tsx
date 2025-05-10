import React, { useState } from 'react';
import interviewIllustration from './students-interview-illustration.jpg';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  TooltipProps, // TooltipProps 타입 임포트
} from 'recharts';
import './App.css'; // App 컴포넌트 스타일

// 데이터 항목 타입 정의
interface ChartDataItem {
  name: string;
  description: string;
  인원: number;
}

// XAxis 틱 프롭 타입 정의
interface CustomizedAxisTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
  data: ChartDataItem[]; // 전체 데이터 배열을 전달받도록 수정
}

// LabelList 프롭 타입 정의
interface CustomizedLabelProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number | string; // value는 숫자 또는 문자열일 수 있음
}

// Tooltip 프롭 타입 정의 (recharts에서 가져온 TooltipProps 사용)
interface CustomTooltipProps extends TooltipProps<number, string> {
  chartType: 'usage' | 'submission' | 'ethics';
}


// 메인 App 컴포넌트
const App: React.FC = () => {
  // 문항 1 데이터
  const usageData: ChartDataItem[] = [
    { name: '1점', description: '전혀 그렇지 않다', 인원: 0 },
    { name: '2점', description: '그렇지 않은 편이다', 인원: 1 },
    { name: '3점', description: '보통이다', 인원: 1 },
    { name: '4점', description: '그런 편이다', 인원: 6 },
    { name: '5점', description: '매우 그렇다', 인원: 10 },
  ];

  // 문항 2 데이터
  const submissionData: ChartDataItem[] = [
    { name: '1점', description: '전혀 그렇지 않다', 인원: 1 },
    { name: '2점', description: '그렇지 않은 편이다', 인원: 2 },
    { name: '3점', description: '보통이다', 인원: 3 },
    { name: '4점', description: '그런 편이다', 인원: 7 },
    { name: '5점', description: '매우 그렇다', 인원: 5 },
  ];

  // 문항 3 데이터
  const ethicsData: ChartDataItem[] = [
    { name: '1점', description: '전혀 그렇지 않다', 인원: 1 },
    { name: '2점', description: '그렇지 않은 편이다', 인원: 3 },
    { name: '3점', description: '보통이다', 인원: 7 },
    { name: '4점', description: '그런 편이다', 인원: 4 },
    { name: '5점', description: '매우 그렇다', 인원: 3 },
  ];

  const [activeTab, setActiveTab] = useState<string>('intro');

  const colors = {
    blue: '#4361ee',
    purple: '#7b2cbf',
    teal: '#2a9d8f',
    background: '#f8f9fa',
    text: '#212529',
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, chartType }) => {
    if (active && payload && payload.length && label) {
      const descriptionMap: { [key: string]: string } = {
        '1점': '전혀 그렇지 않다',
        '2점': '그렇지 않은 편이다',
        '3점': '보통이다',
        '4점': '그런 편이다',
        '5점': '매우 그렇다',
      };

      const colorMap: { [key: string]: string } = {
        usage: 'text-blue-600',
        submission: 'text-purple-600',
        ethics: 'text-teal-600',
      };

      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-bold text-gray-800">
            {label} ({descriptionMap[label.toString()]})
          </p>
          <p className="text-sm text-gray-600">
            인원: <span className={`${colorMap[chartType]} font-semibold`}>{payload[0].value}명</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomizedAxisTick: React.FC<CustomizedAxisTickProps> = (props) => {
    const { x, y, payload, data } = props;
    if (!payload || typeof x === 'undefined' || typeof y === 'undefined') return null;

    const currentItem = data.find(item => item.name === payload.value);
    const description = currentItem ? currentItem.description : '';

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" className="text-xs sm:text-sm">
          {payload.value}
        </text>
        {description && (
          <text x={0} y={16} dy={16} textAnchor="middle" fill="#666" fontSize="10" className="hidden sm:block">
            {description}
          </text>
        )}
      </g>
    );
  };

  const renderCustomizedLabel: React.FC<CustomizedLabelProps> = (props) => {
    const { x, y, width, value } = props;
    if (typeof x === 'undefined' || typeof y === 'undefined' || typeof width === 'undefined' || typeof value === 'undefined') return null;

    return (
      <text
        x={x + width / 2}
        y={y - 6} // 레이블 위치 조정
        fill="#555"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-medium"
      >
        {value}명
      </text>
    );
  };

  const createChartComponent = (
    data: ChartDataItem[],
    title: string,
    description: string,
    color: string,
    chartType: 'usage' | 'submission' | 'ethics',
  ) => {
    return (
      <div className="mt-8 mb-12 p-4 bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-center mb-2 text-gray-800">{title}</h3>
        <p className="text-center mb-6 text-gray-600 italic">"{description}"</p>

        <div className="h-80 w-full md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 30, right: 10, left: 0, bottom: 60 }}
              barSize={50}
              barGap={5}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                tick={<CustomizedAxisTick data={data} />}
                axisLine={{ stroke: '#E0E0E0' }}
                tickLine={false}
                interval={0}
                height={70}
              />
              <YAxis
                tickFormatter={(value) => `${value}명`}
                tick={{ fill: colors.text, fontSize: 12 }}
                axisLine={{ stroke: '#E0E0E0' }}
                tickLine={false}
                label={{ value: '응답자 수 (명)', angle: -90, position: 'insideLeft', fill: '#555', dy: 40, dx: -5, fontSize: 14 }}
                width={70}
              />
              <Tooltip content={<CustomTooltip chartType={chartType} />} cursor={{ fill: 'rgba(206, 206, 206, 0.2)' }} />
              <Bar
                dataKey="인원"
                fill={color}
                radius={[6, 6, 0, 0]}
                animationDuration={1500}
              >
                <LabelList dataKey="인원" content={renderCustomizedLabel as any} /> 
                {/* LabelList의 content 프롭 타입이 복잡하여 any로 캐스팅했습니다. 
                  정확한 타입을 원하시면 recharts 문서를 참고하여 CustomLabelProps를 확장해야 합니다.
                */}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-gray-100 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
            생성형 인공지능 활용과 윤리 인식에 대한 고등학생 실태 조사 보고서
          </h1>
          <p className="text-gray-600 text-md md:text-lg">미림마이스터고등학교 1학년 4반 | 2025년 5월</p>
        </header>

        <div className="flex flex-wrap justify-center mb-8 border-b border-gray-300">
          {['intro', 'survey', 'interview', 'conclusion'].map((tabName) => (
            <button
              key={tabName}
              className={`px-3 py-2 sm:px-4 sm:py-3 font-medium text-sm md:text-base focus:outline-none transition-colors duration-200 ${
                activeTab === tabName ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'
              }`}
              onClick={() => setActiveTab(tabName)}
            >
              {tabName === 'intro' && '조사 개요'}
              {tabName === 'survey' && '설문 결과'}
              {tabName === 'interview' && '심층 인터뷰'}
              {tabName === 'conclusion' && '결론 및 제언'}
            </button>
          ))}
        </div>

        <div className="px-2 md:px-6 py-6 bg-white shadow-xl rounded-lg">
          {activeTab === 'intro' && (
            <div className="prose max-w-none text-gray-700">
              <h2 className="text-2xl font-bold mb-5 text-gray-800 border-b pb-2">1. 조사 동기 및 목적</h2>
              <p className="mb-4">
                최근 생성형 인공지능(Generative AI)의 빠른 확산은 학습과 과제 수행 방식에 커다란 변화를 일으키고 있다. ChatGPT, Gemini, Claude와 같은 도구는 고등학생들에게도 익숙한 존재가 되었고, 이를 통해 학생들은 과제를 더 빠르게, 더 다양하게 수행할 수 있는 기회를 얻고 있다.
              </p>
              <p className="mb-4">
                하지만 이러한 기술 활용은 동시에 윤리적 문제를 수반한다. 예를 들어 생성형 AI의 답변을 그대로 제출하는 것이 과연 표절인지, AI가 작성한 내용을 내가 쓴 것처럼 제출해도 되는지 등은 아직 명확한 기준이 부족하다. 학생들 사이에서도 이러한 문제에 대한 인식 차이가 존재하며, 그로 인해 공정성, 창작성, 책임성에 대한 갈등이 발생하고 있다.
              </p>
              <p className="mb-6">
                따라서 본 조사는 우리 반 학생들이 생성형 AI를 과제 수행에 어느 정도 활용하고 있으며, 그에 대해 어떤 윤리적 인식을 가지고 있는지를 구체적으로 파악하고자 기획되었다.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-md mb-8 border border-blue-200">
                <h3 className="font-bold text-gray-800 mb-2 text-lg">조사 주요 질문</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>생성형 AI를 실제 과제에 얼마나 활용하고 있는가?</li>
                  <li>생성형 AI가 작성한 내용을 수정 없이 제출한 경험이 있는가?</li>
                  <li>그러한 제출이 윤리적으로 문제가 없다고 느끼는가?</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold mb-5 text-gray-800 border-b pb-2">2. 조사 계획</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-2">조사 기간</h3>
                  <p className="text-gray-700">2025년 5월 12일 ~ 5월 16일 (5일간)</p>
                </div>
                <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-2">대상</h3>
                  <p className="text-gray-700">미림마이스터고등학교 1학년 4반 학생 18명 전원</p>
                </div>
                <div className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                  <h3 className="font-bold text-gray-800 mb-2">방법</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    <li>설문조사: Google Forms (Likert 5점 척도)</li>
                    <li>심층 인터뷰: AI 활용 경험이 다양한 3인 선정</li>
                  </ul>
                </div>
              </div>
              
              <p className="mb-4">
                조사는 2025년 5월 12일부터 5월 16일까지 5일간 실시되었으며, 서울시 소재 미림마이스터고등학교 1학년 4반 학생 18명을 대상으로 하였다. 조사 방법은 양적·질적 접근을 혼합한 형태로 구성되었으며, 설문조사와 심층 인터뷰가 병행되었다.
              </p>
              <p className="mb-4">
                설문은 Google Forms를 통해 Likert 5점 척도 문항 3개로 구성되었으며, 문항의 구성은 다음과 같다. 첫째, 생성형 AI를 과제 수행에 활용한 경험 여부(행동), 둘째, AI 산출물을 수정 없이 제출하거나 자신이 쓴 것처럼 제출한 경험(윤리 경계), 셋째, AI 결과물 제출이 문제되지 않는다는 인식(윤리 판단)을 다루었다.
              </p>
              <p className="mb-4">
                이와 함께, 생성형 AI 활용 양상과 인식의 스펙트럼을 심층적으로 탐색하기 위해 3인을 선정하여 개별 인터뷰를 실시하였다. 인터뷰 대상자는 ▲AI 활용해서 코딩을 잘하는 학생, ▲유료 AI를 사용하는 학생, ▲AI를 잘 쓰지 않는 학생으로 구성되었으며, 질문은 공통 문항 2개와 개인화 문항 1개로 이루어졌다.
              </p>
            </div>
          )}

          {activeTab === 'survey' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">3. 설문 조사 결과</h2>
              
              <h3 className="text-xl font-semibold mb-4 text-gray-800">가. AI 활용 경험에 대한 응답 분석</h3>
              {createChartComponent(
                usageData, 
                "문항 1. 생성형 AI 활용 범위", 
                "스스로 해결해야 할 과제를 생성형 AI의 도움을 받아 완성한 적이 있다.", 
                colors.blue,
                "usage"
              )}
              <div className="mb-8 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  전체의 <span className="font-semibold text-blue-600">88.9%</span>가 4점 이상(그런 편이다~매우 그렇다)으로 응답하였다. 이는 생성형 AI가 단순 참고 도구를 넘어 실제 학습 수행 과정에 깊숙이 통합되고 있음을 의미한다. AI는 글쓰기, 코딩, 아이디어 발상 등 다양한 방식으로 학생들의 과제 수행을 실질적으로 보조하고 있으며, 학습 과정 전반에 영향을 미치고 있다.
                </p>
              </div>
              
              <h3 className="text-xl font-semibold mb-4 text-gray-800">나. AI 결과물 제출 방식과 윤리 경계</h3>
              {createChartComponent(
                submissionData, 
                "문항 2. 생성형 AI 산출물 제출 방식", 
                "생성형 AI가 작성한 내용을 별다른 수정 없이 제출하거나, 내가 직접 쓴 것처럼 제출한 적이 있다.", 
                colors.purple,
                "submission"
              )}
              <div className="mb-8 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-purple-600">66.7%</span>가 4점 이상으로 응답하였다. 이는 단순히 AI를 활용하는 것을 넘어서, AI가 생성한 결과물을 학습자의 창작물로 오인하거나 그대로 제출하는 경험이 광범위하게 존재함을 시사한다. 특히 5점(매우 그렇다) 응답자도 5명에 달하여, 일정 비율의 학생은 창작과 표절의 경계를 명확히 인식하지 못하거나 윤리적으로 용인하는 태도를 보이는 것으로 해석된다.
                </p>
              </div>
              
              <h3 className="text-xl font-semibold mb-4 text-gray-800">다. AI 활용에 대한 윤리적 인식</h3>
              {createChartComponent(
                ethicsData, 
                "문항 3. 생성형 AI 활용에 대한 윤리적 인식", 
                "생성형 AI가 작성한 내용을 제출하더라도, 문제될 것이 없다고 느낀 적이 있다.", 
                colors.teal,
                "ethics"
              )}
              <div className="mb-8 bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  <span className="font-semibold text-teal-600">38.9%</span>가 4점 이상으로 응답하였으며, 반대로 <span className="font-semibold text-teal-600">22.2%</span>는 1-2점(그렇지 않은 편이다-전혀 그렇지 않다)으로 명확한 부정적 인식을 드러냈다. 특히 중간 응답(3점)이 <span className="font-semibold text-teal-600">38.9%</span>에 달한 점은 많은 학생들이 AI 활용에 대한 윤리 판단을 유보하거나 혼란을 경험하고 있음을 보여준다. 이는 AI 활용이 보편화되고 있음에도 불구하고, 교육적 차원에서 이에 대한 윤리적 기준이나 실천적 지침이 충분히 제시되지 않았음을 반증한다.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'interview' && (
            <div className="text-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">4. 인터뷰 기반 질적 분석</h2>
              {/* 이미지 추가 */}
              <div className="mb-6 flex justify-center">
                <img
                 src={interviewIllustration}
                 alt="학생 인터뷰 장면 일러스트"
                 className="rounded-lg shadow-md max-w-full md:max-w-2xl"
                 />
              </div>
              
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">1) 활용 기준 인식</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-purple-50 p-4 rounded-lg shadow-sm border border-purple-200">
                    <p className="text-gray-700 italic">"AI 결과물이 너무 티 나면 점수 깎일까 봐 수정함"</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg shadow-sm border border-purple-200">
                    <p className="text-gray-700 italic">"AI가 똑똑할수록 오히려 더 위험하다"</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg shadow-sm border border-purple-200">
                    <p className="text-gray-700 italic">"직접 해야 과제의 의미가 있다"</p>
                  </div>
                </div>
                <p className="mb-4 leading-relaxed">
                  심층 인터뷰를 통해 학생들은 생성형 AI의 활용 과정에서 다양한 심리적 반응과 자기 정당화 논리를 표현하였다. 한 학생은 "시간이 없을 때 그냥 제출했지만 찝찝했다"라고 응답하며 내면적 갈등을 표출하였고, 또 다른 학생은 "그 시간에 다른 공부를 하는 것이 더 낫다고 생각했다"며 효율성에 기반한 판단을 강조하였다.
                </p>
              </div>
              
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">2) 감정적 반응</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
                    <p className="text-gray-700 italic">"계속 쓰다 보면 내가 바보가 되는 느낌"</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
                    <p className="text-gray-700 italic">"뇌가 쪼그라드는 느낌, 무력감이 든다"</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
                    <p className="text-gray-700 italic">"덕분에 앱 개발 프로젝트를 처음으로 혼자 완성했다!"</p>
                  </div>
                </div>
                <p className="mb-4 leading-relaxed">
                  이와 동시에, AI 활용에 대한 부정적 정서도 확인되었다. "계속 AI에 의존하니 내가 바보가 되는 느낌이 들었다", "뇌가 쪼그라드는 것 같았다", "무력감을 느꼈다"는 응답은 도구에 대한 의존이 학습자의 자기 정체성과 능동성에 미치는 심리적 영향을 보여준다. 반면, 유료 사용자였던 학생은 "이전에는 혼자 하기 어려웠던 앱 개발 프로젝트를 AI 덕분에 완성할 수 있었다"고 응답하며, AI가 학습의 확장성과 창의적 도전을 가능케 하는 긍정적 자극이 될 수 있음을 언급하였다.
                </p>
              </div>
              
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">3) 윤리 판단 기준</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-teal-50 p-4 rounded-lg shadow-sm border border-teal-200">
                    <p className="text-gray-700 italic">"다들 쓰니까 괜찮지 않나 싶다"</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg shadow-sm border border-teal-200">
                    <p className="text-gray-700 italic">"출처도 안 밝히고 제출하면 당연히 표절이다"</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg shadow-sm border border-teal-200">
                    <p className="text-gray-700 italic">"그 기준을 학교에서 정확히 알려준 적은 없다"</p>
                  </div>
                </div>
                <p className="mb-4 leading-relaxed">
                  이러한 응답은 AI 활용이 단순히 '윤리적이냐, 아니냐'의 이분법적 문제가 아니라, 학습자의 심리, 정체성, 자율성과 깊이 연결된 복합적 현상임을 시사한다.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'conclusion' && (
            <div className="text-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">5. 결론 및 제언</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">가. 결론 요약</h3>
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm mb-4">
                  <p className="leading-relaxed">
                    조사 결과, 우리 반 학생들은 생성형 AI를 학습 수행에 활발히 활용하고 있으며, 일부는 수정 없는 제출이나 자기 창작물처럼 제출하는 경험도 보유하고 있었다. 그러나 이에 대한 윤리 인식은 뚜렷하게 양분되어 있었다. 일부 학생은 AI 결과물 제출을 문제로 인식하지 않았으며, 반면 다른 학생은 명확한 윤리적 거부감을 드러냈다. 또한 인터뷰를 통해 확인된 바와 같이, AI에 대한 무비판적 사용은 무력감과 자기 상실의 정서를 유발하기도 하였다.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">나. 교육적 제언</h3>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2 text-gray-800">1) AI 활용 기준의 명확화</h4>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200 shadow-sm">
                    <ul className="list-disc pl-5 text-gray-700 mb-3 space-y-1">
                      <li>과제 수행 시 AI 사용 여부를 명시하도록 유도</li>
                      <li>학교 차원의 출처 표기, 재작성 기준 가이드 제공</li>
                    </ul>
                    <p className="leading-relaxed">
                      생성형 AI 활용에 대한 윤리적 기준을 명문화해야 한다. 학교는 학생들이 AI를 활용한 학습에서 '어디까지가 허용되는가'에 대한 명확한 기준과 실천 원칙을 제시해야 하며, 출처 표기 및 재작성 가이드라인을 도입할 필요가 있다.
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2 text-gray-800">2) 창작과 표절의 차이에 대한 교육 강화</h4>
                  <div className="bg-purple-50 p-4 rounded-lg mb-4 border border-purple-200 shadow-sm">
                    <ul className="list-disc pl-5 text-gray-700 mb-3 space-y-1">
                      <li>단순 사용 금지가 아닌, 책임 있는 활용 방법 제시</li>
                      <li>AI가 제공한 내용에 대한 재구성·출처 표시 연습 포함</li>
                    </ul>
                    <p className="leading-relaxed">
                      창작과 표절의 경계를 명확히 하는 윤리 교육이 병행되어야 한다. 단순 금지보다는 책임 있는 활용 방식을 교육하는 것이 효과적이며, AI가 작성한 내용에 대해 어떻게 수정하고 출처를 명시해야 하는지에 대한 실제적인 훈련이 필요하다.
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2 text-gray-800">3) 디지털 시민성과 자율성 교육 통합</h4>
                  <div className="bg-teal-50 p-4 rounded-lg mb-4 border border-teal-200 shadow-sm">
                    <ul className="list-disc pl-5 text-gray-700 mb-3 space-y-1">
                      <li>AI에 대한 비판적 수용 역량과 윤리적 판단력을 함께 기르기</li>
                      <li>"AI 덕분에 가능성을 넓혔다"는 경험과 "내가 사라지는 느낌"이라는 감정을 동시에 수용하는 복합적 교육 설계 필요</li>
                    </ul>
                    <p className="leading-relaxed">
                      디지털 시민성 교육과 자율적 학습 태도 강화가 요구된다. 생성형 AI는 학습의 주체가 아니라 보조 도구임을 명확히 인식시켜야 하며, 학생이 결과물에 대한 비판적 검토 능력과 자기 기여도에 대한 판단력을 갖출 수 있도록 교육과정이 설계되어야 한다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <footer className="mt-12 py-8 border-t border-gray-300">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 미림마이스터고등학교 1학년 4반 | 생성형 AI 윤리 조사 프로젝트</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
