document.addEventListener('DOMContentLoaded', () => {
  const tickerContainer = document.querySelector('.tradingview-widget-container');
  if (!tickerContainer) return;

  const tickerWidget = document.createElement('script');
  tickerWidget.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
  tickerWidget.async = true;
  tickerWidget.textContent = JSON.stringify({
    symbols: [
      { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
      { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
      { proName: 'CMCMARKETS:GOLD', title: 'Gold' },
      { proName: 'BINANCE:SOLUSDT', title: 'Solana' },
      { proName: 'MEXC:USOILUSDT.P', title: 'US Oil' },
      { proName: 'BITSTAMP:XRPUSD', title: 'XRP' },
      { proName: 'NASDAQ:NVDA', title: 'NVIDIA' },
      { proName: 'NASDAQ:AAPL', title: 'Apple' },
      { proName: 'NASDAQ:TSLA', title: 'Tesla' }
    ],
    showSymbolLogo: true,
    isTransparent: true,
    displayMode: 'adaptive',
    colorTheme: 'dark',
    locale: 'en'
  });
  tickerContainer.appendChild(tickerWidget);
});
