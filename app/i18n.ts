export type Lang = 'zh' | 'en';

// All switchable site copy lives here. Add a key to both `zh` and `en`.
export const dictionaries = {
  zh: {
    toggle: 'EN',
    badge: 'EdgeOne Makers · On-Demand ISR',
    title: '按需增量静态再生',
    subtitlePre: '这个页面是静态缓存的：每次访问都返回同一个「生成时间」。只有调用 ',
    subtitleCode: "revalidatePath('/')",
    subtitlePost: ' 后，它才会在 EdgeOne 上被重新生成。',
    generatedLabel: '页面生成时间 / Generated at',
    steps: [
      '反复刷新本页，上面的时间不会变（命中缓存）。',
      '点击上方按钮，或调用 /api/revalidate?path=/ 触发重新验证。',
      'EdgeOne 清除该页 CDN 缓存并重新生成，稍等片刻刷新，时间就更新了。'
    ],
    note: '渲染时间若在几个值间跳动，是被不同边缘节点服务、各自缓存了自己再生的副本 —— 属正常。当使用确定的存储更新时，可以正常完成页面同步。',
    footerDeploy: 'Deployed on EdgeOne Makers',
    button: {
      idle: '触发 Revalidate 并刷新',
      pending: '处理中…',
      success: '已触发重新验证，正在刷新页面…',
      errorPrefix: '触发失败：'
    },
    notFound: {
      message: '页面不存在',
      back: '← 返回首页'
    }
  },
  en: {
    toggle: '中文',
    badge: 'EdgeOne Makers · On-Demand ISR',
    title: 'On-Demand ISR',
    subtitlePre:
      'This page is statically cached — every visit returns the same generated time. It is only regenerated on EdgeOne after calling ',
    subtitleCode: "revalidatePath('/')",
    subtitlePost: '.',
    generatedLabel: 'Generated at',
    steps: [
      'Refresh repeatedly — the time above stays the same (cache hit).',
      'Click the button above, or call /api/revalidate?path=/ to trigger revalidation.',
      'EdgeOne purges this page from the CDN and regenerates it; refresh in a moment and the time updates.'
    ],
    note: 'If the rendered time alternates between a few values, it is served by different edge nodes each caching their own regenerated copy — this is normal. With a deterministic data source, pages sync consistently.',
    footerDeploy: 'Deployed on EdgeOne Makers',
    button: {
      idle: 'Trigger revalidate & reload',
      pending: 'Working…',
      success: 'Revalidation triggered, reloading…',
      errorPrefix: 'Failed: '
    },
    notFound: {
      message: 'Page not found',
      back: '← Back to home'
    }
  }
} as const;

export type Dictionary = (typeof dictionaries)[Lang];
