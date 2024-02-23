export default function Features() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 mb-4">  SignSense translates sign language to spoken language in real-time, enhancing communication accessibility for the deaf and hard of hearing.</h2>
            <p className="text-xl text-gray-400"></p>
          </div>

          {/* Items */}
          <div className="max-w-sm mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16 items-start md:max-w-2xl lg:max-w-none" data-aos-id-blocks>

            {/* 1st item */}
            <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-anchor="[data-aos-id-blocks]">
              <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www/2000/svg">
                <rect className="fill-current text-purple-600" width="64" height="64" rx="32" />
                <path className="stroke-current text-purple-100" d="M30 39.313l-4.18 2.197L27 34.628l-5-4.874 6.91-1.004L32 22.49l3.09 6.26L42 29.754l-3 2.924" strokeLinecap="square" strokeWidth="2" fill="none" fillRule="evenodd" />
                <path className="stroke-current text-purple-300" d="M43 42h-9M43 37h-9" strokeLinecap="square" strokeWidth="2" />
              </svg>
              <h4 className="h4 mb-2">Real-Time Translation</h4>
              <p className="text-lg text-gray-400 text-center">SignSense's real-time translation feature empowers users to receive instant translations of spoken or written content as it occurs. Whether it's a live speech, a business meeting, or a written document, this feature provides immediate and accurate translations without delay. Real-time translation eliminates the need to wait for manual translations or rely on external translators, making communication more efficient and productive. Users can confidently engage in conversations, presentations, or collaborations knowing that SignSense will provide timely and precise translations to bridge the language gap in real-time.</p>
            </div>

            {/* 2nd item */}
            <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-delay="100" data-aos-anchor="[data-aos-id-blocks]">
              <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <circle className="fill-current text-purple-600" cx="32" cy="32" r="32" />
                <path className="stroke-current text-purple-100" strokeWidth="2" strokeLinecap="square" d="M21 23h22v18H21z" fill="none" fillRule="evenodd" />
                <path className="stroke-current text-purple-300" d="M26 28h12M26 32h12M26 36h5" strokeWidth="2" strokeLinecap="square" />
              </svg>
              <h4 className="h4 mb-2">Two-Way Translation</h4>
              <p className="text-lg text-gray-400 text-center">SignSense's two-way translation feature enables seamless communication between two parties who speak different languages. It allows both parties to speak naturally in their respective languages while providing real-time translation of the conversation. This feature ensures that each participant can understand and respond to the other without the need for a human interpreter or the inconvenience of language barriers. Whether it's a face-to-face conversation, a phone call, or a video conference, SignSense's two-way translation ensures clear and effective communication across languages.</p>
            </div>

            {/* 3rd item */}
            <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-delay="200" data-aos-anchor="[data-aos-id-blocks]">
              <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <rect className="fill-current text-purple-600" width="64" height="64" rx="32" />
                <g transform="translate(21 21)" strokeLinecap="square" strokeWidth="2" fill="none" fillRule="evenodd">
                  <ellipse className="stroke-current text-purple-300" cx="11" cy="11" rx="5.5" ry="11" />
                  <path className="stroke-current text-purple-100" d="M11 0v22M0 11h22" />
                  <circle className="stroke-current text-purple-100" cx="11" cy="11" r="11" />
                </g>
              </svg>
              <h4 className="h4 mb-2">Multilingual Support</h4>
              <p className="text-lg text-gray-400 text-center">SignSense offers comprehensive multilingual support, allowing users to translate content to and from a wide range of languages. Whether it's common languages like English, Spanish, and Mandarin, or less widely spoken languages, SignSense supports a diverse array of linguistic needs. This feature ensures that users can communicate effectively with individuals and businesses around the world, regardless of their native language. SignSense's multilingual support promotes inclusivity, fosters global collaboration, and facilitates cross-cultural understanding by breaking down language barriers and enabling seamless communication across borders.</p>
            </div>

            {/* 4th item */}
          

          </div>

        </div>
      </div>
    </section>
  )
}
