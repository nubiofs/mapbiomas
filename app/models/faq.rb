class Faq < ActiveRecord::Base
  validates :question, presence: true, uniqueness: { scope: :locale }
  validates :answer, presence: true
  validates :ordination, presence: true
end
