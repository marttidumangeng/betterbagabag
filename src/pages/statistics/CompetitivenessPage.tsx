import { useMemo, useState } from 'react';

import { CHART_THEME, standardAxisProps } from '@/constants/charts';
import { BarChart3, Target, TrendingUp, Trophy } from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  ChartTooltip,
  ResponsiveChart,
} from '@/components/data-display/ChartContainer';
import { DetailSection } from '@/components/layout/PageLayouts';
import { PageHero } from '@/components/layout/PageLayouts';

import { cn } from '@/lib/utils';

import cmciData from '@/data/statistics/cmci.json';

const PILLAR_COLORS: Record<string, string> = {
  Overall: '#0066eb',
  'Economic Dynamism': '#cc3e00',
  'Government Efficiency': '#059669',
  Infrastructure: '#4f46e5',
  Resiliency: '#d97706',
  Innovation: '#64748b',
};

interface TrendPoint {
  year: number;
  Overall: number | null;
  [key: string]: number | null;
}

function latestNonNullIndex(scores: Array<number | null>): number {
  for (let i = scores.length - 1; i >= 0; i--) {
    if (scores[i] != null) return i;
  }
  return -1;
}

export default function CompetitivenessPage() {
  const displayIdx = useMemo(
    () => latestNonNullIndex(cmciData.overall_score),
    []
  );
  const hasOverall = displayIdx >= 0;
  const hasAnyPillarScore = useMemo(
    () => cmciData.pillars.some(p => p.scores.some(s => s != null)),
    []
  );
  const hasData = hasOverall || hasAnyPillarScore;

  const [activeTab, setActiveTab] = useState<'trends' | 'pillars'>('trends');
  const [selectedPillar, setSelectedPillar] = useState(
    cmciData.pillars[0]?.name ?? ''
  );

  const displayYear =
    displayIdx >= 0 ? cmciData.meta.years[displayIdx] : undefined;
  const overallScore =
    displayIdx >= 0 ? cmciData.overall_score[displayIdx] : null;

  const trendData = useMemo<TrendPoint[]>(() => {
    return cmciData.meta.years
      .map((year, idx) => {
        const dp: TrendPoint = {
          year,
          Overall: cmciData.overall_score[idx] ?? null,
        };
        cmciData.pillars.forEach(p => {
          dp[p.name] = p.scores[idx] ?? null;
        });
        return dp;
      })
      .filter(
        d =>
          d.Overall !== null ||
          cmciData.pillars.some(p => d[p.name] != null)
      );
  }, []);

  const currentPillar = useMemo(
    () => cmciData.pillars.find(p => p.name === selectedPillar),
    [selectedPillar]
  );

  if (!hasData) {
    return (
      <EmptyState
        title='CMCI Data Not Loaded Yet'
        message='Cities and Municipalities Competitiveness Index scores for Bagabag have not been sourced beyond a single overall figure. Pillar series will appear here when published.'
        actionHref='https://cmci.dti.gov.ph/data-portal.php'
        actionLabel='Open DTI CMCI Portal'
      />
    );
  }

  return (
    <>
      <PageHero
        title='Competitiveness'
        description='National evaluation of municipal progress across pillars of governance and development.'
      >
        <div className='flex flex-wrap gap-2 justify-center'>
          {displayYear != null && (
            <Badge variant='primary' dot>
              CMCI {displayYear}
            </Badge>
          )}
          <Badge variant='slate'>DTI Standards</Badge>
        </div>
      </PageHero>

      <div className='grid grid-cols-1 gap-4 items-stretch md:grid-cols-3 mb-kapwa-lg'>
        <StatCard
          label='Overall Score'
          value={
            overallScore != null ? overallScore.toFixed(2) : 'Not yet listed'
          }
          subtext={
            displayYear != null ? `CMCI ${displayYear}` : 'CMCI Index'
          }
          variant='primary'
        />
        <StatCard
          label='Official Rank'
          value='Not yet listed'
          subtext='Pending CMCI rank source'
          variant='secondary'
        />
        <StatCard
          label='Pillars Tracked'
          value={cmciData.pillars.length}
          subtext='DTI Standards'
          variant='slate'
          icon={Trophy}
        />
      </div>

      <nav className='mb-kapwa-lg bg-kapwa-bg-hover flex gap-1.5 rounded-2xl p-1.5'>
        {(['trends', 'pillars'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'min-h-[48px] flex-1 rounded-xl py-3 text-xs font-bold tracking-widest uppercase transition-all',
              activeTab === tab
                ? 'text-kapwa-text-brand-bold bg-kapwa-bg-surface shadow-md'
                : 'hover:text-kapwa-text-support text-kapwa-text-strong0'
            )}
          >
            {tab === 'trends' ? (
              <TrendingUp className='inline mr-1 w-4 h-4' />
            ) : (
              <BarChart3 className='inline mr-1 w-4 h-4' />
            )}
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === 'trends' ? (
        <DetailSection title='Pillar Trends' icon={TrendingUp}>
          {trendData.length === 0 ? (
            <p className='text-kapwa-text-support text-sm'>
              No yearly CMCI points are available yet.
            </p>
          ) : (
            <ResponsiveChart height={384}>
              <LineChart
                data={trendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke={CHART_THEME.grid}
                  strokeDasharray='3 3'
                />
                <XAxis dataKey='year' {...standardAxisProps} dy={10} />
                <YAxis {...standardAxisProps} />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  verticalAlign='top'
                  iconType='circle'
                  wrapperStyle={{
                    paddingBottom: '20px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  }}
                />
                <Line
                  type='monotone'
                  dataKey='Overall'
                  stroke={PILLAR_COLORS.Overall}
                  strokeWidth={4}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                  connectNulls={false}
                />
                {cmciData.pillars.map(p => (
                  <Line
                    key={p.name}
                    type='monotone'
                    dataKey={p.name}
                    stroke={PILLAR_COLORS[p.name]}
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveChart>
          )}
        </DetailSection>
      ) : (
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
          <div className='space-y-3 lg:col-span-5'>
            {cmciData.pillars.map(p => {
              const score =
                displayIdx >= 0 ? p.scores[displayIdx] : null;
              return (
                <button
                  key={p.name}
                  onClick={() => setSelectedPillar(p.name)}
                  className={cn(
                    'flex min-h-[56px] w-full items-center justify-between rounded-2xl border p-4 text-left transition-all',
                    selectedPillar === p.name
                      ? 'bg-kapwa-bg-surface border-kapwa-border-brand shadow-sm'
                      : 'border-kapwa-border-weak bg-kapwa-bg-surface'
                  )}
                >
                  <span
                    className={cn(
                      'text-sm font-bold',
                      selectedPillar === p.name
                        ? 'text-kapwa-text-brand-bold'
                        : 'text-kapwa-text-support'
                    )}
                  >
                    {p.name}
                  </span>
                  <Badge variant='slate'>
                    {score != null ? score.toFixed(2) : '—'}
                  </Badge>
                </button>
              );
            })}
          </div>
          <div className='lg:col-span-7'>
            <DetailSection
              title={`${selectedPillar || 'Pillar'} Indicators`}
              icon={Target}
              className='bg-kapwa-bg-surface/30'
            >
              {(currentPillar?.indicators?.length ?? 0) === 0 ? (
                <p className='text-kapwa-text-support text-sm'>
                  Indicator scores for this pillar are not sourced yet.
                </p>
              ) : (
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                  {currentPillar?.indicators.map((ind, idx) => {
                    const value =
                      displayIdx >= 0 ? ind.values[displayIdx] : null;
                    return (
                      <div
                        key={idx}
                        className='border-kapwa-border-weak bg-kapwa-bg-surface flex min-h-[100px] flex-col justify-between rounded-xl border p-4 shadow-xs'
                      >
                        <span className='text-kapwa-text-disabled text-[10px] leading-tight font-bold tracking-widest uppercase'>
                          {ind.name}
                        </span>
                        <span className='mt-2 text-xl font-black text-kapwa-text-strong'>
                          {value != null ? value.toFixed(4) : '—'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </DetailSection>
          </div>
        </div>
      )}

      <footer className='pt-10 space-y-4 text-center border-t border-kapwa-border-weak'>
        <div className='space-y-1'>
          <p className='text-kapwa-text-strong text-[10px] font-bold tracking-widest uppercase'>
            Partial CMCI series
          </p>
          <p className='text-kapwa-text-disabled text-[10px] font-bold tracking-widest uppercase'>
            Source:{' '}
            <a
              href='https://cmci.dti.gov.ph/data-portal.php'
              target='_blank'
              rel='noreferrer'
              className='underline hover:text-kapwa-text-brand'
            >
              {cmciData.meta.source}
            </a>
          </p>
          {cmciData.meta.notes && (
            <p className='text-kapwa-text-disabled mx-auto max-w-xl text-[10px] font-medium normal-case tracking-normal'>
              {cmciData.meta.notes}
            </p>
          )}
        </div>
      </footer>
    </>
  );
}
