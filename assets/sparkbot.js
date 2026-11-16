(() => {
  const questions = [
    'What markets can I explore?',
    'What is the minimum amount to start?',
    'Is investing risk-free?',
    'How do I get started?',
    'How can I contact support?',
    'What is Solidspark?'
  ];

  function buildSparkBot() {
    if (document.getElementById('sparkbot-launcher')) return;

    const panel = document.createElement('section');
    panel.className = 'sparkbot-panel';
    panel.id = 'sparkbot-panel';
    panel.setAttribute('aria-label', 'SPARK BOT chat');
    panel.setAttribute('aria-hidden', 'true');
    panel.hidden = true;
    panel.innerHTML = `
      <header class="sparkbot-header">
        <div class="sparkbot-brand">
          <img class="sparkbot-avatar" src="Images/logoblue.png" alt="SPARK BOT avatar" />
          <div><p class="sparkbot-title">SPARK BOT</p><span class="sparkbot-status">Solidspark site assistant</span></div>
        </div>
        <button class="sparkbot-close" type="button" aria-label="Close SPARK BOT">&times;</button>
      </header>
      <div class="sparkbot-messages" role="log" aria-live="polite" aria-relevant="additions text">
        <p class="sparkbot-message">Hi, I’m SPARK BOT. Choose a question or ask about the Solidspark website.</p>
      </div>
      <div class="sparkbot-questions" aria-label="Suggested questions"></div>
      <form class="sparkbot-form">
        <label class="sparkbot-visually-hidden" for="sparkbot-input">Ask SPARK BOT a question</label>
        <input id="sparkbot-input" name="question" type="text" placeholder="Ask a question…" autocomplete="off" />
        <button class="sparkbot-send" type="submit" aria-label="Send question">Send</button>
      </form>
      <p class="sparkbot-disclaimer">Automated website help only — not investment advice.</p>`;

    const launcher = document.createElement('button');
    launcher.className = 'sparkbot-launcher';
    launcher.id = 'sparkbot-launcher';
    launcher.type = 'button';
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-controls', 'sparkbot-panel');
    launcher.innerHTML = '<span class="sparkbot-launcher-icon" aria-hidden="true">✦</span> SPARK BOT';

    document.body.append(panel, launcher);

    const questionContainer = panel.querySelector('.sparkbot-questions');
    questions.forEach((question) => {
      const button = document.createElement('button');
      button.className = 'sparkbot-question';
      button.type = 'button';
      button.dataset.sparkbotQuestion = question;
      button.textContent = question;
      questionContainer.append(button);
    });

    // Standalone About page does not include the main app's lower-left contact widget.
    if (!document.querySelector('.whatsapp-circle-btn')) {
      const whatsapp = document.createElement('div');
      whatsapp.className = 'sparkbot-whatsapp';
      whatsapp.innerHTML = `
        <div class="chat-pill-row" id="chat-pill-row">
          <button type="button" class="chat-close-mini" id="close-chat-pill" aria-label="Dismiss chat prompt">✕</button>
          <div class="chat-text-pill">Chat with us</div>
        </div>
        <button type="button" class="whatsapp-circle-btn" aria-label="WhatsApp contact">
          <img src="Images/whatsapp.png" alt="WhatsApp" />
        </button>`;
      document.body.append(whatsapp);
    }

    const closeButton = panel.querySelector('.sparkbot-close');
    const form = panel.querySelector('.sparkbot-form');
    const input = panel.querySelector('#sparkbot-input');
    const sendButton = panel.querySelector('.sparkbot-send');
    const messages = panel.querySelector('.sparkbot-messages');
    const questionButtons = [...panel.querySelectorAll('.sparkbot-question')];
    let busy = false;

    function setOpen(open) {
      panel.hidden = !open;
      panel.setAttribute('aria-hidden', String(!open));
      launcher.setAttribute('aria-expanded', String(open));
      if (open) input.focus();
      else launcher.focus();
    }

    function addMessage(text, kind = 'bot') {
      const message = document.createElement('p');
      message.className = `sparkbot-message${kind === 'user' ? ' is-user' : ''}`;
      message.textContent = text;
      messages.append(message);
      messages.scrollTop = messages.scrollHeight;
      return message;
    }

    function addTypingIndicator() {
      const message = document.createElement('p');
      message.className = 'sparkbot-message sparkbot-typing';
      message.setAttribute('role', 'status');
      message.setAttribute('aria-label', 'SPARK BOT is typing');
      message.innerHTML = '<span></span><span></span><span></span>';
      messages.append(message);
      messages.scrollTop = messages.scrollHeight;
      return message;
    }

    function replyTo(question) {
      const text = question.toLowerCase();
      if (/\b(risk|safe|guarantee|risk-free|risk free|lose money)\b/.test(text)) {
        return 'No investment is risk-free. Values can rise or fall, and you could lose some or all of the amount invested. Review the risks and consider your circumstances before investing.';
      }
      if (/\b(minimum|minima|how much|start with|starting amount|deposit amount)\b/.test(text)) {
        return 'Some supported fractional options are listed with a $500 minimum, while minimums can vary by product. Check the relevant service page for its current details before making a decision.';
      }
      if (/\b(get started|getting started|open an account|register|sign up|create an account)\b/.test(text)) {
        return 'Use the Get started link on the main page to explore the account flow. Review the applicable requirements and terms for the service you choose.';
      }
      if (/\b(support|help|contact|faq|question)\b/.test(text)) {
        return 'Open the Support or FAQs section from the main site navigation for general platform information. SPARK BOT cannot access account-specific details.';
      }
      if (/\b(market|invest|crypto|digital asset|stock|etf|gold|metal|real estate|agriculture|loan|fund recovery|bank|energy)\b/.test(text)) {
        return 'The site has pages covering digital assets, stocks and ETFs, precious metals, real estate, agriculture, loans, fund recovery, and banking and energy. Availability and risks vary by service.';
      }
      if (/\b(solidspark|spark bot)\b/.test(text) || /\b(who are you|about solidspark|about the platform)\b/.test(text)) {
        return 'Solidspark is presented here as a multi-asset investment platform with information about different markets and services. Visit the About page sections or the main site to explore more.';
      }
      return 'I’m SPARK BOT, the Solidspark website assistant. I can help with questions about the platform, supported markets, minimums, getting started, and investing risks. Please ask about one of those topics.';
    }

    function ask(question) {
      const cleaned = question.trim();
      if (!cleaned || busy) return;
      busy = true;
      addMessage(cleaned, 'user');
      input.value = '';
      input.disabled = true;
      sendButton.disabled = true;
      questionButtons.forEach((button) => { button.disabled = true; });
      const typing = addTypingIndicator();
      window.setTimeout(() => {
        typing.remove();
        addMessage(replyTo(cleaned));
        busy = false;
        input.disabled = false;
        sendButton.disabled = false;
        questionButtons.forEach((button) => { button.disabled = false; });
        input.focus();
      }, 2000);
    }

    launcher.addEventListener('click', () => setOpen(panel.hidden));
    closeButton.addEventListener('click', () => setOpen(false));
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      ask(input.value);
    });
    questionButtons.forEach((button) => button.addEventListener('click', () => ask(button.dataset.sparkbotQuestion)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !panel.hidden) setOpen(false);
    });

    const closeChatPill = document.getElementById('close-chat-pill');
    if (closeChatPill) closeChatPill.addEventListener('click', () => {
      const pill = closeChatPill.closest('.chat-pill-row');
      if (pill) pill.hidden = true;
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildSparkBot, { once: true });
  else buildSparkBot();
})();
