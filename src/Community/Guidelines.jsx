export function Guidelines() {
  return (
    <div className="cz-guidelines">
      <span className="cz-guidelines-art">✳</span>
      <h3>A good place starts with us.</h3>
      <p>A few things we believe make a community worth coming back to.</p>
      {[
        [
          'Lead with kindness',
          'There’s a person on the other side of every conversation. Make room for different experiences.',
        ],
        [
          'Be yourself, thoughtfully',
          'Share what matters to you. Respect other people’s privacy and never share their personal information without permission.',
        ],
        [
          'Bring something good',
          'Curiosity, creativity, useful questions. Leave spam, harassment and hateful content outside.',
        ],
        [
          'Look out for each other',
          'Use the report option if something doesn’t belong. Our community moderators review reports.',
        ],
      ].map(([title, copy], i) => (
        <div className="cz-guideline" key={title}>
          <span>0{i + 1}</span>
          <div>
            <h4>{title}</h4>
            <p>{copy}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
