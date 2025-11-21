"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import {
  LinkButton,
  H1,
  H2,
  H3,
  Italic,
  Bold,
  Divider,
  Copy,
  List,
} from "./Core";

export default function Landing() {
  return (
    <div className="flex flex-col gap-12 md:gap-24 lg:gap-36">
      <Hero />
      <Problem />
      <Benefits />
      {/* <SocialProof /> */}
      <Features />
      {/* <FAQ /> */}
      <FinalCTA />
      {/* <Pricing plans={plans} /> */}
    </div>
  );
}

function Hero() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center">
      <Image
        src="/landing/phone-mockup-brown-circle-blank-chart-cropped-sm.png"
        alt="A mockup of a blank sticker chart"
        width={500}
        height={500}
      />
      {/* Headline */}
      <div className="hero-content flex flex-col space-y-4">
        <div className="text-center space-y-4">
          <H1>Raise Responsible Kids Without the Daily Battles</H1>
          <H2>
            Join thousands of families who've discovered peaceful, effective
            parenting
          </H2>
        </div>
        <CTAButton />
        {/* <a
          href="https://startupfa.me/s/stickerch.art?utm_source=stickerch.art"
          target="_blank"
        >
          <img
            src="https://startupfa.me/badges/featured-badge-small.webp"
            alt="stickerch.art - Featured on Startup Fame"
            width="224"
            height="36"
          />
        </a> */}
      </div>
    </div>
  );
}

function Problem() {
  return (
    <div className="flex flex-col lg:flex-row-reverse gap-8 items-center">
      <Image
        className="w-auto"
        src="/landing/phone-mockup-sticker-selection.png"
        alt="A mockup of a sticker chart being customized"
        width={500}
        height={500}
      />
      <div className="hero-content flex flex-col space-y-4">
        <div className="text-center space-y-4">
          <H1>Ditch Complicated Parenting Apps</H1>
          <H2>
            Most kids just need a little positive reinforcement. Stop using apps
            none of you understand. A simple sticker chart will do!
          </H2>
        </div>
      </div>
    </div>
  );
}
function Benefits() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center">
      <Image
        className="w-auto"
        src="/landing/phone-mockup-completed-dialog.png"
        alt="A mockup of a completed sticker chart with a celebration dialog showing"
        width={500}
        height={500}
      />
      <div className="hero-content flex flex-col space-y-4">
        <div className="text-center space-y-4">
          <H1>Replace All Your Paper Sticker Charts With One App</H1>
          <H2>
            No more hunting for the stickers, no more charts falling off the
            wall, no more realizing you're out of sticker charts when you need
            one. Everything you need is at your fingertips.
          </H2>
        </div>
      </div>
    </div>
  );
}
function SocialProof() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <LandingCard>
        <H3>
          ⭐⭐⭐⭐⭐<Bold>Sarah M., Mother of 3 (Ages 6, 9, 12)</Bold>
        </H3>
        <Copy>
          <Italic>
            "This app has completely transformed our mornings. My kids actually
            ASK what they can do to earn their stars instead of me having to
            remind them 10 times to brush their teeth. For the first time in
            years, I feel like I'm parenting with purpose instead of just
            surviving the day."
          </Italic>
        </Copy>
      </LandingCard>
      <LandingCard>
        <H3>
          ⭐⭐⭐⭐⭐<Bold>David R., Father of 2 (Ages 7, 10)</Bold>
        </H3>
        <Copy>
          <Italic>
            "We tried everything - reward charts, allowance systems,
            consequences. Nothing stuck until we found this. My boys now take
            genuine pride in their responsibilities. Last week, my 7-year-old
            told his friend he 'had to earn his screen time' - without any
            prompting from us. That's character building in action."
          </Italic>
        </Copy>
      </LandingCard>
    </div>
  );
}
function Features() {
  return (
    <>
      <div className="flex flex-col lg:flex-row-reverse gap-8 items-center">
        <Image
          className="w-auto"
          src="/landing/phone-mockup-customizations-sm.png"
          alt="Several mockups of sticker charts showing different customizations"
          width={500}
          height={500}
        />
        <div className="hero-content flex flex-col space-y-4">
          <div className="text-center space-y-4">
            <H1>One App, Endless Possibilities</H1>
            <H2>
              Create sticker charts tailored to your family's needs. Change the
              number of squares on the chart for shorter goals, or younger kids.
              Customize the colors of the background and border to anything you
              want. Choose from 20+ stickers, you're guaranteed to find one that
              fits your child.
            </H2>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <Image
          className="w-auto"
          src="/landing/phone-mockup-share-dialog.png"
          alt="A mockup of a sticker chart sharing dialog showing a link that can be copied"
          width={500}
          height={500}
        />
        <div className="hero-content flex flex-col space-y-4">
          <div className="text-center space-y-4">
            <H1>Easily Share Charts With Your Family</H1>
            <H2>
              Whether it's a weekend over at grandma's, or the babysitter is
              over for a night out, or your kid just wants to know how many
              stickers they've got, easily create and share a read-only link to
              your sticker charts.
            </H2>
          </div>
        </div>
      </div>
    </>
  );
}

const FAQItem = ({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="collapse bg-base-100 border-base-300 border join-item">
      <input type="radio" name="my-accordion-1" />
      <div className="collapse-title font-semibold">{question}</div>
      <div className="collapse-content">{children}</div>
    </div>
  );
};

function FAQ() {
  return (
    <div>
      <LandingCard>
        <H2>Common Questions from Concerned Parents</H2>
        <H3>Everything you need to know before getting started</H3>
        <Divider />
        <div className="collapse custom-border border xl:text-xl">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">
            Click to see questions
          </div>
          <div className="collapse-content join join-vertical">
            <FAQItem question="🧒 'What ages work best with this system?'">
              <Copy>
                <Bold>Answer:</Bold>Our digital sticker chart works wonderfully
                for children ages 3-16, with some adaptation:
              </Copy>
              <List>
                <li>
                  <Bold>Ages 3-5:</Bold> Focus on simple, daily tasks (brushing
                  teeth, putting toys away). Use smaller charts (3x3 or 4x4) for
                  quicker success.
                </li>
                <li>
                  <Bold>Ages 6-10:</Bold> Perfect age for building
                  responsibility habits. Can handle larger charts and multiple
                  goals simultaneously. Can handle larger charts and multiple
                  goals simultaneously.
                </li>
                <li>
                  <Bold>Ages 11-16:</Bold> Great for homework tracking, chore
                  systems, and earning privileges. Teenagers appreciate the
                  visual progress and independence. and independence.
                </li>
              </List>
              <Copy>
                The key is adjusting the goals and chart size to match your
                child's attention span and developmental stage. Many families
                use it successfully with multiple children of different ages.
              </Copy>
            </FAQItem>
            <FAQItem question="📱 'How much screen time does this add to my child's day?'">
              <Copy>
                <Bold>Answer:</Bold> Practically none! Unlike games or
                entertainment apps, this takes just 30-60 seconds per day to
                check progress and add stickers.
                <br />
                <br />
                Most families use it like this:
              </Copy>
              <List>
                <li>
                  <Bold>Morning:</Bold> Quick 15-second check of what needs to
                  be done
                </li>
                <li>
                  <Bold>Evening:</Bold> 30-45 seconds to add earned stickers and
                  see progress
                </li>
              </List>
              <Copy>
                Many parents find it actually reduces screen time negotiations
                because children can clearly see what they need to accomplish
                before earning device privileges. It's purposeful screen time
                that builds habits, not mindless entertainment.
              </Copy>
            </FAQItem>
            <FAQItem question="💰 'How is this different from bribing my kids?'">
              <Copy>
                <Bold>Answer:</Bold> This is a common concern among parents who
                want to raise intrinsically motivated children. Here's the key
                difference:
                <br />
                <br />
                <Bold>Bribing</Bold> is offering rewards to stop negative
                behavior in the moment ("If you stop crying, I'll give you
                candy").
                <br />
                <br />
                <Bold>Our system</Bold> teaches that privileges and rewards are
                earned through consistent positive behavior and contribution to
                the family. Children learn that:
              </Copy>
              <List>
                <li>Being part of a family means contributing to the family</li>
                <li>
                  Effort and consistency lead to natural consequences (positive
                  rewards)
                </li>
                <li>Privileges are earned, not automatically given</li>
              </List>
              <Copy>
                The visual tracking helps children internalize these lessons and
                develop genuine pride in their contributions. Over time, many
                children continue helpful behaviors even without the chart
                because the habits become part of their character.
              </Copy>
            </FAQItem>
            <FAQItem
              question={`🔒 "Is my family's information safe and private?"`}
            >
              <Copy>
                <Bold>Answer:</Bold> Absolutely. We take family privacy
                seriously:
              </Copy>
              <List>
                <li>
                  <Bold>No personal information required</Bold> beyond what you
                  choose to enter
                </li>
                <li>
                  <Bold>No data selling</Bold> to third parties - ever
                </li>
                <li>
                  <Bold>Secure sharing links</Bold> that can only view, never
                  edit your charts
                </li>
                <li>
                  <Bold>No social media integration</Bold> or public sharing
                  features
                </li>
                <li>
                  <Bold>Family-safe design</Bold> with no ads, pop-ups, or
                  external links
                </li>
              </List>
              <Copy>
                Your family's progress and information stays within your family.
                We believe parenting tools should protect childhood, not exploit
                it.
              </Copy>
            </FAQItem>
            <FAQItem question={`👥 "Can I use this with multiple children?"`}>
              <Copy>
                <Bold>Answer:</Bold> Yes! This is actually one of our most
                popular features with larger families:
              </Copy>
              <List>
                <li>
                  <Bold>Unlimited charts</Bold> - each child can have their
                  favorite colors and stickers
                </li>
                <li>
                  <Bold>Individual customization</Bold> - each child can have
                  their favorite colors and stickers
                </li>
                <li>
                  <Bold>Fair and clear</Bold> - no more arguments about who has
                  easier or harder tasks
                </li>
                <li>
                  <Bold>Age-appropriate goals</Bold> - different expectations
                  for different developmental stages
                </li>
              </List>
              <Copy>
                Many families create charts for individual goals (homework,
                chores) and family teamwork goals (keeping the house clean,
                helping with meals).
              </Copy>
            </FAQItem>
            <FAQItem
              question={`⏱️ "What if my child loses interest or motivation?"`}
            >
              <Copy>
                <Bold>Answer:</Bold> This is natural with any system, and we've
                built in several ways to maintain engagement:
              </Copy>
              <List>
                <li>
                  <Bold>Fresh starts</Bold> - when charts are completed,
                  children can start new ones with different goals
                </li>
                <li>
                  <Bold>Customization changes</Bold> - switch up stickers,
                  colors, or chart sizes to renew interest
                </li>
                <li>
                  <Bold>Seasonal goals</Bold> - adapt charts for different times
                  of year or family priorities
                </li>
                <li>
                  <Bold>Natural breaks</Bold> - it's okay to pause and restart
                  when life gets busy
                </li>
              </List>
              <Copy>
                The key is that habits often continue even when the chart isn't
                actively used. Many parents find their children maintain helpful
                behaviors because the chart helped them develop genuine routines
                and pride in contributing.
                <br />
                <br />
                Remember: the goal isn't eternal chart use, but building
                character and habits that last a lifetime.
              </Copy>
            </FAQItem>
            <FAQItem
              question={`🤔 "Will this replace real-world consequences and discipline?"`}
            >
              <Copy>
                <Bold>Answer:</Bold> No - this system works{" "}
                <Italic>alongside</Italic> your existing parenting approach, not
                instead of it.
                <br />
                <br />
                <Bold>What it does:</Bold>
              </Copy>
              <List>
                <li>Provides positive motivation for desired behaviors</li>
                <li>Creates clear expectations and consistent tracking</li>
                <li>Celebrates effort and achievement</li>
                <li>Builds habits through visual progress</li>
              </List>
              <Copy>
                <Bold>What it doesn't do:</Bold>
              </Copy>
              <List>
                <li>Replace the need for boundaries and consequences</li>
                <li>Handle serious behavioral issues or safety concerns</li>
                <li>
                  Substitute for parent-child communication and relationship
                  building
                </li>
              </List>
              <Copy>
                Think of it as a tool that makes your parenting more effective
                by reducing daily friction around routine responsibilities,
                giving you more energy to focus on character development,
                relationship building, and addressing more serious issues when
                they arise.
              </Copy>
            </FAQItem>
            <FAQItem
              question={`💻 "Do I need to download an app or software?"`}
            >
              <Copy>
                <Bold>Answer:</Bold> No downloads required! Our system works
                through any web browser on any device:
              </Copy>
              <List>
                <li>
                  <Bold>Phones and tablets</Bold> - works perfectly on both
                  iPhone and Android
                </li>
                <li>
                  <Bold>Computers </Bold> - access from any laptop or desktop
                </li>
                <li>
                  <Bold>No storage space</Bold> needed on your devices
                </li>
                <li>
                  <Bold>Automatic updates</Bold> - always have the latest
                  features without managing downloads
                </li>
                <li>
                  <Bold>Cross-device access</Bold> - start on your phone, check
                  on your computer
                </li>
              </List>
              <Copy>
                This also means grandparents, babysitters, or other caregivers
                can easily access and use the charts when watching your
                children.
              </Copy>
            </FAQItem>
            <FAQItem
              question={`📚 "Can this help with homework and school responsibilities?"`}
            >
              <Copy>
                <Bold>Answer:</Bold> Absolutely! Many families use our charts
                specifically for academic goals:
                <br />
                <br />
                <Bold>Homework tracking:</Bold>
              </Copy>
              <List>
                <li>Daily reading time</li>
                <li>Assignment completion</li>
                <li>Study habits</li>
                <li>Getting backpack ready for school</li>
              </List>
              <Copy>
                <Bold>Study skills:</Bold>
              </Copy>
              <List>
                <li>Time management</li>
                <li>Organization systems</li>
                <li>Test preparation</li>
                <li>Long-term project milestones</li>
              </List>
              <Copy>
                <Bold>School behavior:</Bold>
              </Copy>
              <List>
                <li>Following classroom rules</li>
                <li>Teacher communication</li>
                <li>Completing school chores or responsibilities</li>
              </List>
              <Copy>
                The visual progress helps children see their academic efforts
                adding up over time, building the self-discipline and
                consistency that leads to academic success.
              </Copy>
            </FAQItem>
          </div>
        </div>
      </LandingCard>
    </div>
  );
}

type PricingProps = {
  plans: {
    priceId: string;
    name: string;
    description: string;
    price: string;
    featureList: string[];
    greatFor: string;
    mode: "payment" | "subscription";
  }[];
};

function FinalCTA() {
  return (
    <div className="hero-content flex flex-col space-y-4">
      <div className="text-center space-y-4">
        <H1>Easy to Try, No Commitment Required</H1>
        <H2>
          With just an email address, you can use stickerch.art free for a whole
          week. Decide if it's right for you and your family. If so, we have
          flexible pricing plans for every family, and no payment info is
          required until you decide to buy.
        </H2>
      </div>
      <CTAButton />
    </div>
  );
}

function Pricing({ plans }: PricingProps) {
  return (
    <div className="flex flex-col gap-4">
      <H1>Ready to Transform Your Family Dynamic?</H1>
      <div className="flex flex-col gap-4">
        {plans.map((plan, index) => (
          <LandingCard key={index}>
            <div className="flex flex-col">
              <div className="text-2xl xl:text-4xl font-bold">{plan.name}</div>
              <div className="text-lg xl:text-2xl mt-2">{plan.description}</div>
              <List>
                {plan.featureList.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </List>
              <div className="mt-2 xl:text-xl font-semibold">
                <Italic>Great for: {plan.greatFor}</Italic>
              </div>
            </div>
          </LandingCard>
        ))}
      </div>
      <CTAButton />
    </div>
  );
}

export function CTAButton() {
  return <LinkButton href="/signin">START YOUR FREE WEEK NOW</LinkButton>;
}

export function LandingHeadline({ text }: { text: string }) {
  return (
    <h1 className="text-center text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
      {text}
    </h1>
  );
}

export function LandingSubheadline({ text }: { text: string }) {
  return (
    <div className="text-center text-xl md:text-2xl lg:text-3xl xl:text-4xl mt-4">
      {text}
    </div>
  );
}

export function LandingSection({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col lg:flex-row gap-4">{children}</div>;
}

export function LandingCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`h-full p-4 md:p-8 ${className}`}>{children}</div>;
}
