import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <div className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-slate-600">
              Common questions about the Fresh 535 movement, strategy, and implementation.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">What is Fresh 535?</AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Fresh 535 is a nonpartisan voter instruction movement. We ask Americans to vote against all incumbent
                members of Congress — all 535 — to force accountability through turnover. We don't endorse candidates or
                promote policy platforms. Our sole focus is restoring electoral competition and accountability.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                Does this favor one political party?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                No. The rule applies equally to all incumbents regardless of party affiliation. We believe the problem
                is systemic, not partisan. Both parties have contributed to the current dysfunction in Congress. In
                Republican districts, this helps Democratic challengers. In Democratic districts, it helps Republican
                challengers. Over time, this creates equal pressure on both parties.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                Is Fresh 535 a PAC or political organization?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                No. We are a voter education and coordination movement. We don't raise money for candidates, make
                endorsements, or engage in traditional political activities. We simply provide information and encourage
                voter participation. We operate as a 501(c)(4) social welfare organization focused on civic education.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                What if I like my current representative?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Individual representatives may be well-intentioned, but they operate within a broken system. Even "good"
                incumbents participate in a system that prioritizes fundraising and special interests over constituent
                needs. The system itself needs to change. Your representative's individual merit is less important than
                the institutional dysfunction they're part of. Sacrificing one good representative is worth fixing the
                entire system.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                What if the challenger is unqualified or extreme?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                New representatives haven't been captured by the current system yet. They're more likely to be
                responsive to voters than to lobbyists and donors. Additionally, the threat of replacement will moderate
                behavior across the board. As districts become more competitive, higher-quality candidates will be
                attracted to run. The current system already produces dysfunction — we're trading known failure for
                potential improvement.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                Won't this create chaos and inexperience in Congress?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                The current system is already chaotic and dysfunctional. Fresh perspectives and new energy often lead to
                better outcomes than entrenched interests and stale thinking. Many of our most effective periods in
                Congress have followed major turnover events. Institutional knowledge exists in committee staff and
                support structures, not just in individual members.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                How many people do you need to make this work?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Primary elections typically have 15-25% turnout, and many general elections are decided by small
                margins. A coordinated 20% of voters can swing most elections. We don't need a majority — just enough
                people to create real electoral consequences. Even the threat of organized opposition will change
                incumbent behavior.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                What happens after we replace everyone?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                New representatives will be more responsive to voters because they'll know that electoral consequences
                are real. Districts will choose their own direction with fresh leadership. The goal is accountability,
                not any specific policy outcome. A Congress that knows it can be fired will govern differently than one
                that considers itself permanent.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">Do you accept donations?</AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Yes, we accept donations for operational costs like website maintenance, data analysis, and voter
                education materials. We never accept or distribute money for candidates. All donations go toward
                movement infrastructure and civic education. We publish quarterly financial reports for full
                transparency.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                How do I know which candidates are incumbents?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Incumbents are current office holders running for re-election. Your ballot will typically indicate this,
                or you can check your state's election website. If someone is currently serving in Congress, they're an
                incumbent. We're developing tools to help voters easily identify incumbents in their district.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-11" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                What about local and state elections?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Fresh 535 focuses specifically on federal Congressional elections — the House and Senate. Local and
                state elections have different dynamics and may require different approaches. We believe fixing Congress
                is the highest priority for restoring functional governance at the federal level.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-12" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">Is this legal?</AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Absolutely. Voter education and coordination are fundamental rights in a democracy. We encourage legal
                participation in the electoral process and don't engage in any activities that would violate election
                laws. We operate transparently and within all applicable regulations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-13" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">How can I help spread the word?</AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Share our hashtags (#Fresh535, #FireThemAll, #IfTheyreInTheyreOut), tell five people about the movement,
                and encourage others to take the pledge. Use our social media graphics and printable materials. Social
                media sharing and word-of-mouth are our primary tools for growth. Every conversation matters.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-14" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">What's your success metric?</AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Success is measured by increased electoral competition and accountability. This includes: higher
                incumbent defeat rates, closer election margins, more qualified challengers running, and ultimately,
                improved congressional performance on key issues. We track these metrics publicly and adjust strategy
                based on results.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-15" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold">
                Why not work within the existing parties?
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 pt-2">
                Both parties benefit from the current system of safe seats and incumbent protection. They have no
                incentive to reform a system that keeps them in power. Real change requires external pressure from
                voters who are willing to cross party lines to demand accountability. This is bigger than partisan
                politics.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="text-center mt-16 bg-gray-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-lg text-slate-600 mb-6">
              We're here to help. Contact us with any questions not covered here.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
