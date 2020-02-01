class Exercise < ApplicationRecord
  belongs_to :program
  has_one :video
end
